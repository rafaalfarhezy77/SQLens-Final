from sqlalchemy.orm import Session
from app.db.session import engine
from app.services.query_execution import QueryExecutionService
from app.core.errors import PublicApiError


def test_10_scenarios():
    svc = QueryExecutionService()
    test_queries = [
        ("1. SELECT sederhana", "SELECT id, name FROM students;"),
        ("2. WHERE filter", "SELECT id, name, major FROM students WHERE major = 'Informatika';"),
        ("3. JOIN", "SELECT s.name, sc.score FROM students s JOIN scores sc ON s.id = sc.student_id;"),
        ("4. Multiple JOIN", "SELECT s.name, sc.score, c.title FROM students s JOIN scores sc ON s.id = sc.student_id JOIN courses c ON sc.course = c.title;"),
        ("5. GROUP BY", "SELECT major, COUNT(*) AS jml FROM students GROUP BY major;"),
        ("6. HAVING", "SELECT major, COUNT(*) AS jml FROM students GROUP BY major HAVING COUNT(*) >= 2;"),
        ("7. ORDER BY", "SELECT name FROM students ORDER BY name DESC;"),
        ("8. LIMIT", "SELECT id, name FROM students LIMIT 2;"),
        ("9. Query error", "SELECT invalid_col FROM students;"),
        ("10. Multi-table Indonesian View", "SELECT m.nama, n.nilai, mk.nama_mata_kuliah FROM mahasiswa m JOIN nilai n ON m.id = n.mahasiswa_id JOIN matakuliah mk ON n.matakuliah = mk.nama_mata_kuliah WHERE n.nilai >= 80;"),
    ]

    with Session(engine) as session:
        for name, query in test_queries:
            if "invalid" in query:
                try:
                    svc.execute(session, query=query)
                    assert False, f"Expected error for {name}"
                except PublicApiError as e:
                    assert e.code == "QUERY_EXECUTION_FAILED"
            else:
                cols, rows, elapsed, stages = svc.execute(session, query=query)
                assert len(cols) > 0
                assert len(stages) > 0
                for stage in stages:
                    assert "stepNumber" in stage
                    assert "clause" in stage
                    assert "rowsAfterCount" in stage
                    assert "nodeType" in stage
