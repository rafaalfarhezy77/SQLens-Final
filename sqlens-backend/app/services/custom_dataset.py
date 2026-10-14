import csv
import io
import re
from typing import Any
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.errors import PublicApiError
from app.schemas.datasets import DatasetTableResponse

MAX_TABLES = 5
MAX_ROWS_PER_TABLE = 1000
MAX_CONTENT_BYTES = 2 * 1024 * 1024  # 2 MB

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


def _json_value(value: Any) -> str | int | float | bool | None:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return str(value)


def sanitize_identifier(raw: str, prefix: str = "item") -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_]", "_", raw.strip().lower())
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    if not cleaned or not cleaned[0].isalpha():
        cleaned = f"{prefix}_{cleaned}" if cleaned else prefix
    return cleaned[:63]


def infer_column_type(values: list[str]) -> str:
    non_empty = [v.strip() for v in values if v is not None and v.strip() != ""]
    if not non_empty:
        return "TEXT"

    is_int = True
    for v in non_empty:
        try:
            int(v)
        except ValueError:
            is_int = False
            break
    if is_int:
        return "BIGINT"

    is_float = True
    for v in non_empty:
        try:
            float(v)
        except ValueError:
            is_float = False
            break
    if is_float:
        return "NUMERIC"

    return "TEXT"


def cast_value(val: str, col_type: str) -> Any:
    trimmed = val.strip() if val is not None else ""
    if trimmed == "" or trimmed.lower() == "null":
        return None
    if col_type == "BIGINT":
        try:
            return int(trimmed)
        except ValueError:
            return None
    if col_type == "NUMERIC":
        try:
            return float(trimmed)
        except ValueError:
            return None
    return val


class CustomDatasetService:
    def get_user_schema_name(self, user_id: str) -> str:
        safe_id = sanitize_identifier(user_id, prefix="usr")
        return f"usr_{safe_id}"

    def user_schema_exists(self, session: Session, user_id: str) -> bool:
        schema = self.get_user_schema_name(user_id)
        result = session.execute(
            text("SELECT 1 FROM pg_namespace WHERE nspname = :schema"),
            {"schema": schema},
        ).scalar()
        return result is not None

    def get_custom_dataset(
        self, session: Session, user_id: str
    ) -> tuple[bool, list[DatasetTableResponse]]:
        if not self.user_schema_exists(session, user_id):
            return False, []

        schema = self.get_user_schema_name(user_id)
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

            # Fetch up to 10 sample rows
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
                    relationship=f"Tabel kustom {table_name} dari database pengguna.",
                )
            )

        return True, tables

    def reset_user_dataset(self, session: Session, user_id: str) -> None:
        schema = self.get_user_schema_name(user_id)
        session.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
        session.commit()

    def import_csv_files(
        self, session: Session, user_id: str, files: list[tuple[str, str]]
    ) -> list[DatasetTableResponse]:
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

        schema = self.get_user_schema_name(user_id)

        # Parse and validate all files first
        parsed_tables = []
        used_table_names: set[str] = set()

        for filename, content_str in files:
            if len(content_str.encode("utf-8")) > MAX_CONTENT_BYTES:
                raise PublicApiError(
                    status_code=400,
                    code="FILE_TOO_LARGE",
                    message=f"Ukuran file {filename} melebihi batas maksimum 2 MB.",
                )

            # Strip BOM if present
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

            # Sanitize table name
            raw_base_name = filename.rsplit(".", 1)[0]
            table_name = sanitize_identifier(raw_base_name, prefix="tabel")
            base_tname = table_name
            counter = 1
            while table_name in used_table_names:
                table_name = f"{base_tname}_{counter}"
                counter += 1
            used_table_names.add(table_name)

            # Sanitize column names
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

            # Read rows
            rows_data: list[list[str]] = []
            for row in reader:
                if len(rows_data) >= MAX_ROWS_PER_TABLE:
                    break
                # pad or trim row to header length
                padded = row[: len(col_names)] + [""] * max(
                    0, len(col_names) - len(row)
                )
                rows_data.append(padded)

            # Infer column types
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

        # Create schema and tables in database
        session.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
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

        session.commit()

        # Return updated dataset
        _, tables = self.get_custom_dataset(session, user_id)
        return tables

    def import_sql_script(
        self, session: Session, user_id: str, sql_content: str
    ) -> list[DatasetTableResponse]:
        if len(sql_content.encode("utf-8")) > MAX_CONTENT_BYTES:
            raise PublicApiError(
                status_code=400,
                code="FILE_TOO_LARGE",
                message="Ukuran skrip SQL melebihi batas maksimum 2 MB.",
            )

        # Basic validation of statements
        # Split on semicolon, ignoring empty
        statements = [
            s.strip()
            for s in sql_content.split(";")
            if s.strip()
        ]
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
                    code="FORBIDDEN_SQL_IN_CUSTOM_DATASET",
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

        schema = self.get_user_schema_name(user_id)
        session.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
        session.execute(text(f'CREATE SCHEMA "{schema}"'))

        # Run inside schema and ensure search_path is reset afterwards
        try:
            session.execute(text(f'SET search_path = "{schema}", public'))
            for stmt in validated_statements:
                session.execute(text(stmt))

            # Check total tables
            t_count = session.execute(
                text(
                    "SELECT count(*) FROM information_schema.tables "
                    "WHERE table_schema = :schema AND table_type = 'BASE TABLE'"
                ),
                {"schema": schema},
            ).scalar()
            if (t_count or 0) > MAX_TABLES:
                session.rollback()
                self.reset_user_dataset(session, user_id)
                raise PublicApiError(
                    status_code=400,
                    code="EXCEEDED_MAX_TABLES",
                    message=f"Jumlah tabel melebihi batas maksimum {MAX_TABLES}.",
                )

            session.commit()
        finally:
            session.execute(text('SET search_path = public'))
            session.commit()
        _, tables = self.get_custom_dataset(session, user_id)
        return tables
