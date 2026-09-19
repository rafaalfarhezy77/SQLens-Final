from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import PublicApiError
from app.core.passwords import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import Role


class AuthService:
    def register_student(
        self, session: Session, *, name: str, email: str, password: str, role: Role = "mahasiswa"
    ) -> User:
        normalized_email = email.strip().lower()
        if session.scalar(select(User.id).where(User.email == normalized_email)):
            raise PublicApiError(status_code=409, code="EMAIL_ALREADY_REGISTERED", message="Email sudah terdaftar.")
        user = User(name=name.strip(), email=normalized_email, password_hash=hash_password(password), role=role)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user

    def authenticate(self, session: Session, *, email: str, password: str) -> User:
        user = session.scalar(select(User).where(User.email == email.strip().lower()))
        if not user or not verify_password(password, user.password_hash):
            raise PublicApiError(status_code=401, code="INVALID_CREDENTIALS", message="Email atau kata sandi tidak cocok.")
        return user
