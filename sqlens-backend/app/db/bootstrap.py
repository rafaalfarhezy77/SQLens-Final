"""Create the local development schema and deterministic educational dataset."""

from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models import QueryHistory, User  # noqa: F401 - registers model metadata


def bootstrap() -> None:
    Base.metadata.create_all(bind=engine)

    statements = [
        """
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          major VARCHAR(255) NOT NULL
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY,
          student_id INTEGER NOT NULL REFERENCES students(id),
          course VARCHAR(255) NOT NULL,
          score INTEGER NOT NULL,
          grade VARCHAR(8) NOT NULL
        )
        """,
        """
        INSERT INTO students (id, name, major) VALUES
          (1, 'Andi Pratama', 'Informatika'),
          (2, 'Budi Santoso', 'Sistem Informasi'),
          (3, 'Citra Dewi', 'Informatika'),
          (4, 'Dian Anggraini', 'Teknik Komputer')
        ON CONFLICT (id) DO NOTHING
        """,
        """
        INSERT INTO scores (id, student_id, course, score, grade) VALUES
          (101, 1, 'Basis Data', 90, 'A'),
          (102, 2, 'Basis Data', 85, 'A'),
          (103, 3, 'Basis Data', 70, 'B'),
          (104, 4, 'Basis Data', 65, 'C')
        ON CONFLICT (id) DO NOTHING
        """,
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


if __name__ == "__main__":
    bootstrap()
