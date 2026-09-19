import unittest

from app.services.educational_stages import build_educational_stages


class FakeResult:
    def __init__(self, rows: list[dict[str, object]]) -> None:
        self._rows = rows

    def mappings(self) -> list[dict[str, object]]:
        return self._rows


class FakeSession:
    def execute(self, statement: object) -> FakeResult:
        sql = str(statement).upper()
        if "FROM STUDENTS" in sql and "JOIN" not in sql:
            return FakeResult([{"id": 1, "name": "Andi", "major": "Informatika"}])
        if "FROM SCORES" in sql and "JOIN" not in sql:
            return FakeResult([{"id": 101, "student_id": 1, "score": 90}])
        return FakeResult([{"name": "Andi", "score": 90}])


class EducationalStageTests(unittest.TestCase):
    def test_where_query_has_source_where_and_select_stages(self) -> None:
        stages = build_educational_stages(
            FakeSession(),  # type: ignore[arg-type]
            query="SELECT name FROM students WHERE major = 'Informatika'",
            final_rows=[{"name": "Andi"}],
        )
        self.assertEqual([stage["clause"] for stage in stages], ["FROM", "WHERE", "SELECT"])
        self.assertEqual(stages[1]["rowsBeforeCount"], 1)
        self.assertEqual(stages[1]["rowsAfterCount"], 1)

    def test_join_query_has_real_join_metadata_shape(self) -> None:
        stages = build_educational_stages(
            FakeSession(),  # type: ignore[arg-type]
            query="SELECT s.name, sc.score FROM students s INNER JOIN scores sc ON s.id = sc.student_id",
            final_rows=[{"name": "Andi", "score": 90}],
        )
        join_stage = stages[1]
        self.assertEqual(join_stage["clause"], "JOIN")
        self.assertEqual(join_stage["joinDetails"]["leftTable"], "students")
        self.assertEqual(join_stage["joinDetails"]["rightTable"], "scores")
