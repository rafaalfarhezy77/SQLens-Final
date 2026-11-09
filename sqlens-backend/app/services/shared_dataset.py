import csv
import io
import re
from uuid import uuid4
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.errors import PublicApiError
from app.models.shared_dataset import SharedDataset
from app.schemas.datasets import DatasetTableResponse
from app.schemas.shared_dataset import (
    SharedDatasetDetailResponse,
    SharedDatasetResponse,
)
from app.services.custom_dataset import (
    MAX_CONTENT_BYTES,
    MAX_ROWS_PER_TABLE,
    MAX_TABLES,
    _json_value,
    cast_value,
    infer_column_type,
    sanitize_identifier,
)

FORBIDDEN_SQL_KEYWORDS = {
    "ALTER",
    "CALL",
    "COPY",
    "DELETE",
    "DO",
    "DROP",
    "EXECUTE",
    "GRANT",
    "MERGE",
    "REVOKE",
    "TRUNCATE",
    "UPDATE",
    "VACUUM",
    "SET",
    "RESET",
}


class SharedDatasetService:
    def _get_schema_tables(
        self, session: Session, schema: str
    ) -> list[DatasetTableResponse]:
        table_rows = session.execute(
            text(
                "SELECT table_name FROM information_schema.tables "
                "WHERE table_schema = :schema AND table_type = 'BASE TABLE' "
                "ORDER BY table_name"
            ),
            {"schema": schema},
        ).fetchall()

        tables: list[DatasetTableResponse] = []
        for (table_name,) in table_rows:
            col_rows = session.execute(
                text(
                    "SELECT column_name FROM information_schema.columns "
                    "WHERE table_schema = :schema AND table_name = :table "
                    "ORDER BY ordinal_position"
                ),
                {"schema": schema, "table": table_name},
            ).fetchall()
            columns = [c[0] for c in col_rows]

            result = session.execute(
                text(f'SELECT * FROM "{schema}"."{table_name}" LIMIT 10')
            )
            rows = [
                {col: _json_value(val) for col, val in row.items()}
                for row in result.mappings()
            ]

            tables.append(
                DatasetTableResponse(
                    name=table_name,
                    columns=columns,
                    rows=rows,
                    relationship=f"Tabel {table_name} dari dataset kelas bersama.",
                )
            )
        return tables

    def list_shared_datasets(self, session: Session) -> list[SharedDatasetResponse]:
        records = (
            session.query(SharedDataset)
            .filter(SharedDataset.is_active == True)  # noqa: E712
            .order_by(SharedDataset.created_at.desc())
            .all()
        )
        return [
            SharedDatasetResponse(
                id=r.id,
                title=r.title,
                description=r.description,
                schemaName=r.schema_name,
                tableNames=[t.strip() for t in r.table_names.split(",") if t.strip()],
                createdBy=r.created_by,
                createdByName=r.created_by_name,
                isActive=r.is_active,
                createdAt=r.created_at,
            )
            for r in records
        ]

    def get_shared_dataset_detail(
        self, session: Session, dataset_id: str
    ) -> SharedDatasetDetailResponse:
        record = (
            session.query(SharedDataset)
            .filter(SharedDataset.id == dataset_id, SharedDataset.is_active == True)  # noqa: E712
            .first()
        )
        if not record:
            raise PublicApiError(
                status_code=404,
                code="SHARED_DATASET_NOT_FOUND",
                message=f"Dataset bersama dengan ID '{dataset_id}' tidak ditemukan.",
            )

        tables = self._get_schema_tables(session, record.schema_name)
        return SharedDatasetDetailResponse(
            id=record.id,
            title=record.title,
            description=record.description,
            schemaName=record.schema_name,
            tableNames=[t.strip() for t in record.table_names.split(",") if t.strip()],
            createdBy=record.created_by,
            createdByName=record.created_by_name,
            isActive=record.is_active,
            createdAt=record.created_at,
            tables=tables,
        )

    def get_schema_for_shared_dataset(
        self, session: Session, dataset_id: str
    ) -> str | None:
        record = (
            session.query(SharedDataset)
            .filter(SharedDataset.id == dataset_id, SharedDataset.is_active == True)  # noqa: E712
            .first()
        )
        return record.schema_name if record else None

    def create_shared_dataset_from_csv(
        self,
        session: Session,
        *,
        user_id: str,
        user_name: str,
        title: str,
        description: str,
        files: list[tuple[str, str]],
    ) -> SharedDatasetDetailResponse:
        if not files:
            raise PublicApiError(
                status_code=400,
                code="NO_FILES_PROVIDED",
                message="Setidaknya satu file CSV harus diunggah.",
            )
        if len(files) > MAX_TABLES:
            raise PublicApiError(
                status_code=400,
                code="EXCEEDED_MAX_TABLES",
                message=f"Jumlah tabel maksimum yang diperbolehkan adalah {MAX_TABLES}.",
            )

        dataset_id = str(uuid4())
        short_id = dataset_id.replace("-", "")[:12]
        schema = f"shared_{short_id}"

        parsed_tables = []
        used_table_names: set[str] = set()

        for filename, content_str in files:
            if len(content_str.encode("utf-8")) > MAX_CONTENT_BYTES:
                raise PublicApiError(
                    status_code=400,
                    code="FILE_TOO_LARGE",
                    message=f"Ukuran file {filename} melebihi batas maksimum 2 MB.",
                )

            cleaned_content = content_str.lstrip("\ufeff")
            reader = csv.reader(io.StringIO(cleaned_content))
            try:
                headers = next(reader, None)
            except Exception as e:
                raise PublicApiError(
                    status_code=400,
                    code="INVALID_CSV",
                    message=f"File {filename} bukan format CSV yang valid.",
                ) from e

            if not headers:
                raise PublicApiError(
                    status_code=400,
                    code="EMPTY_CSV",
                    message=f"File {filename} tidak memiliki baris header atau kosong.",
                )

            raw_base_name = filename.rsplit(".", 1)[0]
            table_name = sanitize_identifier(raw_base_name, prefix="tabel")
            base_tname = table_name
            counter = 1
            while table_name in used_table_names:
                table_name = f"{base_tname}_{counter}"
                counter += 1
            used_table_names.add(table_name)

            col_names: list[str] = []
            used_cols: set[str] = set()
            for i, h in enumerate(headers):
                cname = sanitize_identifier(h, prefix=f"col_{i+1}")
                base_cname = cname
                c_idx = 1
                while cname in used_cols:
                    cname = f"{base_cname}_{c_idx}"
                    c_idx += 1
                used_cols.add(cname)
                col_names.append(cname)

            rows_data: list[list[str]] = []
            for row in reader:
                if len(rows_data) >= MAX_ROWS_PER_TABLE:
                    break
                padded = row[: len(col_names)] + [""] * max(
                    0, len(col_names) - len(row)
                )
                rows_data.append(padded)

            col_types: list[str] = []
            for col_idx in range(len(col_names)):
                col_vals = [r[col_idx] for r in rows_data]
                col_types.append(infer_column_type(col_vals))

            parsed_tables.append(
                {
                    "table_name": table_name,
                    "columns": col_names,
                    "types": col_types,
                    "rows": rows_data,
                }
            )

        session.execute(text(f'CREATE SCHEMA "{schema}"'))

        for tbl in parsed_tables:
            tname = tbl["table_name"]
            col_defs = ", ".join(
                f'"{cname}" {ctype}'
                for cname, ctype in zip(tbl["columns"], tbl["types"])
            )
            create_sql = f'CREATE TABLE "{schema}"."{tname}" ({col_defs})'
            session.execute(text(create_sql))

            if tbl["rows"]:
                cols_str = ", ".join(f'"{c}"' for c in tbl["columns"])
                placeholders = ", ".join(f":p_{i}" for i in range(len(tbl["columns"])))
                insert_sql = text(
                    f'INSERT INTO "{schema}"."{tname}" ({cols_str}) VALUES ({placeholders})'
                )

                for r in tbl["rows"]:
                    params = {
                        f"p_{i}": cast_value(r[i], tbl["types"][i])
                        for i in range(len(tbl["columns"]))
                    }
                    session.execute(insert_sql, params)

        table_names_str = ",".join(used_table_names)
        record = SharedDataset(
            id=dataset_id,
            title=title.strip(),
            description=description.strip(),
            schema_name=schema,
            table_names=table_names_str,
            created_by=user_id,
            created_by_name=user_name,
            is_active=True,
        )
        session.add(record)
        session.commit()

        tables = self._get_schema_tables(session, schema)
        return SharedDatasetDetailResponse(
            id=record.id,
            title=record.title,
            description=record.description,
            schemaName=record.schema_name,
            tableNames=list(used_table_names),
            createdBy=record.created_by,
            createdByName=record.created_by_name,
            isActive=record.is_active,
            createdAt=record.created_at,
            tables=tables,
        )

    def create_shared_dataset_from_sql(
        self,
        session: Session,
        *,
        user_id: str,
        user_name: str,
        title: str,
        description: str,
        sql_content: str,
    ) -> SharedDatasetDetailResponse:
        if len(sql_content.encode("utf-8")) > MAX_CONTENT_BYTES:
            raise PublicApiError(
                status_code=400,
                code="FILE_TOO_LARGE",
                message="Ukuran skrip SQL melebihi batas maksimum 2 MB.",
            )

        statements = [s.strip() for s in sql_content.split(";") if s.strip()]
        if not statements:
            raise PublicApiError(
                status_code=400,
                code="EMPTY_SQL",
                message="Skrip SQL tidak berisi perintah yang valid.",
            )

        sql_token_pattern = re.compile(r"[A-Z_]+")
        validated_statements: list[str] = []

        for stmt in statements:
            tokens = set(sql_token_pattern.findall(stmt.upper()))
            forbidden = tokens & FORBIDDEN_SQL_KEYWORDS
            if forbidden:
                raise PublicApiError(
                    status_code=400,
                    code="FORBIDDEN_SQL_IN_SHARED_DATASET",
                    message=f"Skrip SQL berisi operasi yang dilarang: {', '.join(sorted(forbidden))}.",
                )
            first_keyword = stmt.strip().split()[0].upper()
            if first_keyword not in {"CREATE", "INSERT"}:
                raise PublicApiError(
                    status_code=400,
                    code="UNSUPPORTED_STATEMENT",
                    message="Skrip kustom hanya boleh memuat perintah CREATE TABLE dan INSERT INTO.",
                )
            validated_statements.append(stmt)

        dataset_id = str(uuid4())
        short_id = dataset_id.replace("-", "")[:12]
        schema = f"shared_{short_id}"

        session.execute(text(f'CREATE SCHEMA "{schema}"'))

        try:
            session.execute(text(f'SET search_path = "{schema}", public'))
            for stmt in validated_statements:
                session.execute(text(stmt))
            session.execute(text('SET search_path = "public"'))
        except Exception as e:
            session.execute(text('SET search_path = "public"'))
            session.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
            session.commit()
            raise PublicApiError(
                status_code=400,
                code="SQL_EXECUTION_ERROR",
                message=f"Gagal menjalankan skrip SQL: {str(e)}",
            ) from e

        tables = self._get_schema_tables(session, schema)
        table_names_str = ",".join(t.name for t in tables)

        record = SharedDataset(
            id=dataset_id,
            title=title.strip(),
            description=description.strip(),
            schema_name=schema,
            table_names=table_names_str,
            created_by=user_id,
            created_by_name=user_name,
            is_active=True,
        )
        session.add(record)
        session.commit()

        return SharedDatasetDetailResponse(
            id=record.id,
            title=record.title,
            description=record.description,
            schemaName=record.schema_name,
            tableNames=[t.name for t in tables],
            createdBy=record.created_by,
            createdByName=record.created_by_name,
            isActive=record.is_active,
            createdAt=record.created_at,
            tables=tables,
        )

    def delete_shared_dataset(
        self, session: Session, dataset_id: str, user_id: str, user_role: str
    ) -> None:
        record = (
            session.query(SharedDataset).filter(SharedDataset.id == dataset_id).first()
        )
        if not record:
            raise PublicApiError(
                status_code=404,
                code="SHARED_DATASET_NOT_FOUND",
                message=f"Dataset bersama dengan ID '{dataset_id}' tidak ditemukan.",
            )

        if record.created_by != user_id and user_role != "dosen":
            raise PublicApiError(
                status_code=403,
                code="FORBIDDEN",
                message="Anda tidak memiliki izin untuk menghapus dataset bersama ini.",
            )

        session.execute(text(f'DROP SCHEMA IF EXISTS "{record.schema_name}" CASCADE'))
        session.delete(record)
        session.commit()
