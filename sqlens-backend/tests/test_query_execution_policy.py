import unittest

from app.core.errors import PublicApiError
from app.services.query_execution import validate_read_only_query


class QueryExecutionPolicyTests(unittest.TestCase):
    def test_accepts_single_select(self) -> None:
        self.assertEqual(validate_read_only_query("SELECT id FROM students;"), "SELECT id FROM students")

    def test_rejects_modifying_statement(self) -> None:
        with self.assertRaises(PublicApiError) as context:
            validate_read_only_query("DELETE FROM students")
        self.assertEqual(context.exception.code, "READ_ONLY_POLICY_VIOLATION")

    def test_rejects_multiple_statements(self) -> None:
        with self.assertRaises(PublicApiError) as context:
            validate_read_only_query("SELECT id FROM students; SELECT id FROM scores")
        self.assertEqual(context.exception.code, "MULTIPLE_STATEMENTS_FORBIDDEN")
