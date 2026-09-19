import unittest

from app.core.passwords import hash_password, verify_password


class PasswordTests(unittest.TestCase):
    def test_hash_is_not_plaintext_and_verifies(self) -> None:
        encoded = hash_password("password-aman")
        self.assertNotEqual(encoded, "password-aman")
        self.assertTrue(verify_password("password-aman", encoded))

    def test_wrong_password_does_not_verify(self) -> None:
        self.assertFalse(verify_password("salah", hash_password("password-aman")))
