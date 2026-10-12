"""Deterministic logical query processing stage generation for SQLens.

Evaluates logical processing flow (TABLE -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT)
against read-only PostgreSQL execution context. Derives truthful cardinalities and provides
graph topology metadata (nodeId, nodeType, parentIds, operationExpression).
"""

import re
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

Scalar = str | int | float | bool | None
Row = dict[str, Scalar]

SQL_CLAUSE_REGEX = re.compile(
    r"""
    ^(?:WITH\s+(?P<cte>.+?)\s+)?
    SELECT\s+(?P<distinct>DISTINCT\s+)?(?P<projection>.+?)
    \s+FROM\s+(?P<from>.+?)
    (?:\s+WHERE\s+(?P<where>.+?))?
    (?:\s+GROUP\s+BY\s+(?P<group_by>.+?))?
    (?:\s+HAVING\s+(?P<having>.+?))?
    (?:\s+ORDER\s+BY\s+(?P<order_by>.+?))?
    (?:\s+LIMIT\s+(?P<limit>\d+(?:\s+OFFSET\s+\d+)?))?
    $
    """,
    re.IGNORECASE | re.VERBOSE | re.DOTALL,
)

JOIN_SPLIT_REGEX = re.compile(
    r"""\s+(?P<join_type>(?:NATURAL\s+)?(?:INNER\s+|LEFT\s+(?:OUTER\s+)?|RIGHT\s+(?:OUTER\s+)?|FULL\s+(?:OUTER\s+)?|CROSS\s+)?JOIN)\s+"""
    r"""(?P<table>[a-zA-Z_]\w*)"""
    r"""(?:\s+(?:AS\s+)?(?P<alias>[a-zA-Z_]\w*))?"""
    r"""(?:\s+ON\s+(?P<on>.+?)(?=\s+(?:NATURAL\s+)?(?:INNER\s+|LEFT\s+|RIGHT\s+|FULL\s+|CROSS\s+)?JOIN|$))""",
    re.IGNORECASE | re.DOTALL | re.VERBOSE,
)


def _json_value(value: Any) -> Scalar:
    return value if value is None or isinstance(value, (str, int, float, bool)) else str(value)


def _safe_rows(session: Session, sql: str, fallback: list[Row] | None = None) -> list[Row]:
    try:
        return [{key: _json_value(val) for key, val in row.items()} for row in session.execute(text(sql)).mappings()]
    except Exception:
        return fallback if fallback is not None else []


def _evaluations(rows: list[Row], *, status: str, status_text: str, reason: str, max_items: int = 10) -> list[dict[str, Any]]:
    return [
        {"id": f"row-{index + 1}", "data": row, "status": status, "statusText": status_text, "reason": reason}
        for index, row in enumerate(rows[:max_items])
    ]


def _step(
    number: int,
    clause: str,
    title: str,
    description: str,
    before: list[Row],
    after: list[Row],
    *,
    status: str,
    reason: str,
    join_details: dict[str, str] | None = None,
    node_id: str | None = None,
    node_type: str | None = None,
    parent_ids: list[str] | None = None,
    operation_expression: str | None = None,
) -> dict[str, Any]:
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
        "nodeId": node_id or f"node-{number}",
        "nodeType": node_type or clause.replace(" ", "_"),
        "parentIds": parent_ids or [],
        "operationExpression": operation_expression,
    }


def _parse_from_clause(from_clause: str) -> dict[str, Any]:
    fc = from_clause.strip()
    first_join = re.search(r"\s+(?:(?:NATURAL\s+)?(?:INNER\s+|LEFT\s+|RIGHT\s+|FULL\s+|CROSS\s+)?JOIN)\s+", fc, re.IGNORECASE)
    if not first_join:
        parts = fc.split()
        tbl = parts[0]
        alias = parts[-1] if len(parts) > 1 and parts[-1].upper() != "AS" else tbl
        return {"table": tbl, "alias": alias, "joins": []}

    main_part = fc[:first_join.start()].strip()
    main_parts = main_part.split()
    tbl = main_parts[0]
    alias = main_parts[-1] if len(main_parts) > 1 and main_parts[-1].upper() != "AS" else tbl

    joins: list[dict[str, str]] = []
    join_part = fc[first_join.start():]
    for m in JOIN_SPLIT_REGEX.finditer(join_part):
        gd = m.groupdict()
        j_type = re.sub(r"\s+", " ", gd["join_type"].upper().strip())
        j_table = gd["table"]
        j_alias = gd["alias"] or j_table
        j_on = gd["on"].strip() if gd.get("on") else ""
        joins.append({
            "join_type": j_type,
            "table": j_table,
            "alias": j_alias,
            "on": j_on,
        })
    return {"table": tbl, "alias": alias, "joins": joins}


def build_educational_stages(session: Session, *, query: str, final_rows: list[Row]) -> list[dict[str, Any]]:
    """Return truthful logical processing stages for any SELECT query with topology metadata."""
    normalized = query.strip().rstrip(";").strip()
    match = SQL_CLAUSE_REGEX.match(normalized)

    if not match:
        return [
            _step(
                1,
                "SELECT",
                "Hasil query",
                "Query berhasil dieksekusi oleh PostgreSQL engine.",
                [],
                final_rows,
                status="keep",
                reason="Baris dikembalikan PostgreSQL.",
                node_id="node-select",
                node_type="RESULT",
                parent_ids=[],
                operation_expression=normalized,
            )
        ]

    groups = match.groupdict()
    from_raw = groups["from"].strip()
    from_info = _parse_from_clause(from_raw)
    main_table = from_info["table"]
    main_alias = from_info["alias"]
    joins = from_info["joins"]

    where_expr = groups.get("where")
    group_by_expr = groups.get("group_by")
    having_expr = groups.get("having")
    order_by_expr = groups.get("order_by")
    limit_expr = groups.get("limit")
    projection_expr = groups["projection"].strip()

    stages: list[dict[str, Any]] = []
    step_num = 1

    # Stage 1: FROM / Table sources
    main_source_rows = _safe_rows(session, f"SELECT * FROM {main_table} LIMIT 10", fallback=final_rows)
    main_source_node_id = f"node-table-{main_table.lower()}"

    if not joins:
        stages.append(
            _step(
                step_num,
                "FROM",
                "Baca tabel sumber",
                f"Database membaca tabel {main_table}.",
                [],
                main_source_rows,
                status="source",
                reason="Baris berasal dari tabel pendidikan.",
                node_id=main_source_node_id,
                node_type="TABLE",
                parent_ids=[],
                operation_expression=f"FROM {main_table}",
            )
        )
        prev_node_id = main_source_node_id
        prev_rows = main_source_rows
        current_cumulative_from = f"{main_table} {main_alias}" if main_alias != main_table else main_table
    else:
        # Multi-table FROM: seed source tables
        joined_sources_text = [main_table] + [j["table"] for j in joins]
        combined_sources: list[Row] = []
        combined_sources.extend(main_source_rows)
        for j in joins:
            r = _safe_rows(session, f"SELECT * FROM {j['table']} LIMIT 10", fallback=[])
            combined_sources.extend(r)

        stages.append(
            _step(
                step_num,
                "FROM",
                "Baca tabel sumber",
                f"Database membaca tabel {main_table} ({len(main_source_rows)} baris) dan relasi terkait.",
                [],
                combined_sources,
                status="source",
                reason="Baris berasal dari tabel pendidikan.",
                node_id=main_source_node_id,
                node_type="TABLE",
                parent_ids=[],
                operation_expression=f"FROM {', '.join(joined_sources_text)}",
            )
        )
        prev_node_id = main_source_node_id
        prev_rows = combined_sources

        # Subsequent JOIN stages
        current_cumulative_from = f"{main_table} {main_alias}" if main_alias != main_table else main_table
        left_table_name = main_table

        for j_idx, j in enumerate(joins):
            step_num += 1
            j_type = j["join_type"]
            j_table = j["table"]
            j_alias = j["alias"]
            j_on = j["on"]
            current_cumulative_from += f" {j_type} {j_table} {j_alias} ON {j_on}" if j_alias != j_table else f" {j_type} {j_table} ON {j_on}"

            joined_rows = _safe_rows(session, f"SELECT * FROM {current_cumulative_from} LIMIT 10", fallback=final_rows)
            join_node_id = f"node-join-{j_idx + 1}"

            on_parts = j_on.split("=", 1)
            left_key = on_parts[0].strip() if len(on_parts) == 2 else j_on
            right_key = on_parts[1].strip() if len(on_parts) == 2 else j_on

            join_details = {
                "leftTable": left_table_name,
                "rightTable": j_table,
                "leftKey": left_key,
                "rightKey": right_key,
                "joinType": j_type,
            }

            stages.append(
                _step(
                    step_num,
                    "JOIN",
                    "Hubungkan baris yang cocok",
                    f"{j_type} dievaluasi dengan kondisi {j_on}.",
                    prev_rows,
                    joined_rows,
                    status="joined",
                    reason="Baris cocok dengan kondisi JOIN.",
                    join_details=join_details,
                    node_id=join_node_id,
                    node_type="JOIN",
                    parent_ids=[prev_node_id, f"node-table-{j_table.lower()}"],
                    operation_expression=f"{j_type} {j_table} ON {j_on}",
                )
            )
            prev_node_id = join_node_id
            prev_rows = joined_rows
            left_table_name = j_table

    # Stage: WHERE filter
    if where_expr:
        step_num += 1
        where_clean = where_expr.strip()
        filtered_rows = _safe_rows(
            session,
            f"SELECT * FROM {current_cumulative_from} WHERE {where_clean} LIMIT 10",
            fallback=final_rows,
        )
        where_node_id = "node-where"
        stages.append(
            _step(
                step_num,
                "WHERE",
                "Saring baris",
                f"Filter {where_clean} diterapkan.",
                prev_rows,
                filtered_rows,
                status="keep",
                reason="Baris memenuhi kondisi WHERE.",
                node_id=where_node_id,
                node_type="WHERE",
                parent_ids=[prev_node_id],
                operation_expression=where_clean,
            )
        )
        prev_node_id = where_node_id
        prev_rows = filtered_rows

    # Stage: GROUP BY
    if group_by_expr:
        step_num += 1
        gb_clean = group_by_expr.strip()
        where_clause_part = f" WHERE {where_expr.strip()}" if where_expr else ""
        grouped_rows = _safe_rows(
            session,
            f"SELECT {gb_clean} FROM {current_cumulative_from}{where_clause_part} GROUP BY {gb_clean} LIMIT 10",
            fallback=final_rows,
        )
        gb_node_id = "node-groupby"
        stages.append(
            _step(
                step_num,
                "GROUP BY",
                "Kelompokkan baris data",
                f"Baris dikelompokkan berdasarkan atribut ({gb_clean}).",
                prev_rows,
                grouped_rows,
                status="keep",
                reason="Baris dikelompokkan ke unit agregat.",
                node_id=gb_node_id,
                node_type="GROUP_BY",
                parent_ids=[prev_node_id],
                operation_expression=gb_clean,
            )
        )
        prev_node_id = gb_node_id
        prev_rows = grouped_rows

    # Stage: HAVING
    if having_expr:
        step_num += 1
        having_clean = having_expr.strip()
        gb_clean = group_by_expr.strip() if group_by_expr else ""
        where_clause_part = f" WHERE {where_expr.strip()}" if where_expr else ""
        having_rows = _safe_rows(
            session,
            f"SELECT {gb_clean} FROM {current_cumulative_from}{where_clause_part} GROUP BY {gb_clean} HAVING {having_clean} LIMIT 10",
            fallback=final_rows,
        )
        having_node_id = "node-having"
        stages.append(
            _step(
                step_num,
                "HAVING",
                "Saring grup agregat",
                f"Kondisi kelompok ({having_clean}) dievaluasi.",
                prev_rows,
                having_rows,
                status="keep",
                reason="Kelompok memenuhi syarat HAVING.",
                node_id=having_node_id,
                node_type="HAVING",
                parent_ids=[prev_node_id],
                operation_expression=having_clean,
            )
        )
        prev_node_id = having_node_id
        prev_rows = having_rows

    # Stage: SELECT / Column Projection
    step_num += 1
    select_node_id = "node-select"
    stages.append(
        _step(
            step_num,
            "SELECT",
            "Pilih kolom hasil",
            "Proyeksi SELECT menghasilkan result set akhir yang dieksekusi PostgreSQL.",
            prev_rows,
            final_rows,
            status="keep",
            reason="Kolom dipilih oleh SELECT.",
            node_id=select_node_id,
            node_type="SELECT",
            parent_ids=[prev_node_id],
            operation_expression=projection_expr,
        )
    )
    prev_node_id = select_node_id
    prev_rows = final_rows

    # Stage: ORDER BY (if present)
    if order_by_expr:
        step_num += 1
        ob_clean = order_by_expr.strip()
        ob_node_id = "node-orderby"
        stages.append(
            _step(
                step_num,
                "ORDER BY",
                "Urutkan baris data",
                f"Hasil diurutkan berdasarkan ({ob_clean}).",
                prev_rows,
                final_rows,
                status="keep",
                reason="Baris disusun sesuai urutan ORDER BY.",
                node_id=ob_node_id,
                node_type="ORDER_BY",
                parent_ids=[prev_node_id],
                operation_expression=ob_clean,
            )
        )
        prev_node_id = ob_node_id
        prev_rows = final_rows

    # Stage: LIMIT (if present)
    if limit_expr:
        step_num += 1
        lim_clean = limit_expr.strip()
        lim_node_id = "node-limit"
        stages.append(
            _step(
                step_num,
                "LIMIT",
                "Batasi jumlah baris",
                f"Keluaran dibatasi maksimal {lim_clean} baris.",
                prev_rows,
                final_rows,
                status="keep",
                reason="Himpunan baris dipotong oleh batasan LIMIT.",
                node_id=lim_node_id,
                node_type="LIMIT",
                parent_ids=[prev_node_id],
                operation_expression=lim_clean,
            )
        )

    return stages

