from datetime import timezone
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.query_history import QueryHistory
from app.models.user import User


class LecturerService:
    def get_student_activities(self, session: Session, limit: int = 50) -> list[dict]:
        # Query query_history with outer join to users
        query = (
            select(QueryHistory, User)
            .outerjoin(User, QueryHistory.user_id == User.id)
            .order_by(QueryHistory.executed_at.desc())
            .limit(limit)
        )
        results = session.execute(query).all()

        activities: list[dict] = []
        # Pre-count total attempts per user
        user_counts = dict(
            session.execute(
                select(QueryHistory.user_id, func.count(QueryHistory.id)).group_by(QueryHistory.user_id)
            ).all()
        )

        for hist, user in results:
            # If user exists and is dosen, skip or include if student
            if user and user.role == "dosen":
                continue

            name = user.name if user else f"Mahasiswa {hist.user_id[:6]}"
            email = user.email if user else f"{hist.user_id[:6]}@sqlens.edu"
            occurred_at_iso = (
                hist.executed_at.replace(tzinfo=timezone.utc).isoformat()
                if hist.executed_at.tzinfo is None
                else hist.executed_at.isoformat()
            )

            activities.append({
                "id": hist.id,
                "studentName": name,
                "email": email,
                "query": hist.query,
                "status": "success" if hist.status == "success" else "error",
                "occurredAt": occurred_at_iso,
                "count": user_counts.get(hist.user_id, 1),
            })

        return activities

    def get_student_progress(self, session: Session) -> list[dict]:
        # Query all student users
        students = list(session.scalars(select(User).where(User.role == "mahasiswa")).all())

        progress_list: list[dict] = []
        for s in students:
            # Get stats from query_history for this student
            total_success = session.scalar(
                select(func.count(QueryHistory.id)).where(
                    QueryHistory.user_id == s.id, QueryHistory.status == "success"
                )
            ) or 0

            latest_hist = session.scalar(
                select(QueryHistory.executed_at)
                .where(QueryHistory.user_id == s.id)
                .order_by(QueryHistory.executed_at.desc())
                .limit(1)
            )

            latest_iso = None
            if latest_hist:
                latest_iso = (
                    latest_hist.replace(tzinfo=timezone.utc).isoformat()
                    if latest_hist.tzinfo is None
                    else latest_hist.isoformat()
                )

            # Cap progress percent at 100%, 20% per successful query milestone
            percent = min(100, int(total_success * 20)) if total_success > 0 else 0

            progress_list.append({
                "id": s.id,
                "studentName": s.name,
                "successfulQueries": total_success,
                "progressPercent": percent,
                "latestActivity": latest_iso,
            })

        # If no students in DB yet, return deterministic empty list
        return progress_list
