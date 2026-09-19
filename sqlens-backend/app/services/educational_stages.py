"""Deterministic stage generation for SQLens' deliberately small teaching subset.

This is not a PostgreSQL execution-plan adapter. It analyzes only SELECT queries
over the seeded ``students`` and ``scores`` tables and derives row counts and
rows by issuing read-only SQL against the same transaction/database. Queries
outside the subset still execute, but receive only a truthful final SELECT stage.
"""

import re
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

Scalar = str | int | float | bool | None
Row = dict[str, Scalar]

_SINGLE_TABLE = re.compile(
    r"^SELECT\s+(?P<projection>.+?)\s+FROM\s+(?P<table>students|scores)(?:\s+(?P<alias>[a-zA-Z_]\w*))?(?:\s+WHERE\s+(?P<where>.+))?$",
    re.IGNORECASE | re.DOTALL,
)
_JOIN = re.compile(
    r"^SELECT\s+(?P<projection>.+?)\s+FROM\s+(?P<left>students|scores)(?:\s+(?P<left_alias>[a-zA-Z_]\w*))?\s+(?P<join_type>INNER\s+)?JOIN\s+(?P<right>students|scores)(?:\s+(?P<right_alias>[a-zA-Z_]\w*))?\s+ON\s+(?P<on>.+?)(?:\s+WHERE\s+(?P<where>.+))?$",
    re.IGNORECASE | re.DOTALL,
)


def _json_value(value: Any) -> Scalar:
    return value if value is None or isinstance(value, (str, int, float, bool)) else str(value)


def _rows(session: Session, sql: str) -> list[Row]:
    return [{key: _json_value(value) for key, value in row.items()} for row in session.execute(text(sql)).mappings()]


def _evaluations(rows: list[Row], *, status: str, status_text: str, reason: str) -> list[dict[str, Any]]:
    return [
        {"id": f"row-{index + 1}", "data": row, "status": status, "statusText": status_text, "reason": reason}
        for index, row in enumerate(rows)
    ]


def _step(number: int, clause: str, title: str, description: str, before: list[Row], after: list[Row], *, status: str, reason: str, join_details: dict[str, str] | None = None) -> dict[str, Any]:
    return {
        "stepNumber": number,
        "clause": clause,
        "title": title,
        "badge": clause,
        "description": description,
        "explanation": description,
        "rowsBeforeCount": len(before),
        "rowsAfterCount": len(after),
        "rowEvaluations": _evaluations(after, status=status, status_text="Dipertahankan", reason=reason),
        "joinDetails": join_details,
    }


def build_educational_stages(session: Session, *, query: str, final_rows: list[Row]) -> list[dict[str, Any]]:
    """Return evidence-backed stages for the SQLens supported teaching subset."""
    normalized = query.strip().rstrip(";").strip()
    join_match = _JOIN.match(normalized)
    if join_match:
        values = join_match.groupdict()
        left = values["left"]
        right = values["right"]
        left_alias = values.get("left_alias") or left
        right_alias = values.get("right_alias") or right
        on_expression = values["on"].strip()
        where_expression = values.get("where")
        source_left = _rows(session, f"SELECT * FROM {left}")
        source_right = _rows(session, f"SELECT * FROM {right}")
        joined_sql = f"SELECT * FROM {left} {left_alias} INNER JOIN {right} {right_alias} ON {on_expression}"
        joined_rows = _rows(session, joined_sql)
        parts = on_expression.split("=", 1)
        left_key = parts[0].strip() if len(parts) == 2 else on_expression
        right_key = parts[1].strip() if len(parts) == 2 else on_expression
        stages = [
            _step(1, "FROM", "Baca tabel sumber", f"Database membaca tabel {left} ({len(source_left)} baris) dan {right} ({len(source_right)} baris).", [], source_left + source_right, status="source", reason="Baris berasal dari tabel pendidikan."),
            _step(2, "JOIN", "Hubungkan baris yang cocok", f"INNER JOIN dievaluasi dengan kondisi {on_expression}.", source_left + source_right, joined_rows, status="joined", reason="Baris cocok dengan kondisi JOIN.", join_details={"leftTable": left, "rightTable": right, "leftKey": left_key, "rightKey": right_key, "joinType": "INNER JOIN"}),
        ]
        if where_expression:
            filtered_rows = _rows(session, f"{joined_sql} WHERE {where_expression.strip()}")
            stages.append(_step(3, "WHERE", "Saring baris", f"Filter {where_expression.strip()} diterapkan pada hasil JOIN.", joined_rows, filtered_rows, status="keep", reason="Baris memenuhi kondisi WHERE."))
        rows_before_projection = filtered_rows if where_expression else joined_rows
        stages.append(_step(len(stages) + 1, "SELECT", "Pilih kolom hasil", "Proyeksi SELECT menghasilkan result set akhir yang dieksekusi PostgreSQL.", rows_before_projection, final_rows, status="keep", reason="Kolom dipilih oleh SELECT."))
        return stages

    single_match = _SINGLE_TABLE.match(normalized)
    if single_match:
        values = single_match.groupdict()
        table = values["table"]
        source_rows = _rows(session, f"SELECT * FROM {table}")
        stages = [_step(1, "FROM", "Baca tabel sumber", f"Database membaca tabel {table}.", [], source_rows, status="source", reason="Baris berasal dari tabel pendidikan.")]
        where_expression = values.get("where")
        if where_expression:
            filtered_rows = _rows(session, f"SELECT * FROM {table} WHERE {where_expression.strip()}")
            stages.append(_step(2, "WHERE", "Saring baris", f"Filter {where_expression.strip()} diterapkan pada tabel sumber.", source_rows, filtered_rows, status="keep", reason="Baris memenuhi kondisi WHERE."))
        stages.append(_step(len(stages) + 1, "SELECT", "Pilih kolom hasil", "Proyeksi SELECT menghasilkan result set akhir yang dieksekusi PostgreSQL.", source_rows, final_rows, status="keep", reason="Kolom dipilih oleh SELECT."))
        return stages

    return [_step(1, "SELECT", "Hasil query", "Query berhasil dieksekusi. Visualisasi rinci tersedia untuk SELECT, WHERE, dan INNER JOIN pada dataset pendidikan.", [], final_rows, status="keep", reason="Baris dikembalikan PostgreSQL.")]
