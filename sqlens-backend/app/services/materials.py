from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import PublicApiError
from app.models.material import LearningMaterial
from app.schemas.materials import MaterialCreateRequest, MaterialUpdateRequest


class MaterialService:
    def list_materials(self, session: Session) -> list[LearningMaterial]:
        return list(session.scalars(select(LearningMaterial).order_by(LearningMaterial.created_at.desc())).all())

    def get_material(self, session: Session, *, material_id: str) -> LearningMaterial:
        material = session.scalar(select(LearningMaterial).where(LearningMaterial.id == material_id))
        if not material:
            raise PublicApiError(status_code=404, code="MATERIAL_NOT_FOUND", message="Materi tidak ditemukan.")
        return material

    def create_material(
        self, session: Session, *, payload: MaterialCreateRequest, created_by: str | None = None
    ) -> LearningMaterial:
        material = LearningMaterial(
            title=payload.title,
            topic=payload.topic,
            difficulty=payload.difficulty,
            content=payload.content,
            sample_sql=payload.sample_sql,
            status=payload.status,
            created_by=created_by,
        )
        session.add(material)
        session.commit()
        session.refresh(material)
        return material

    def update_material(
        self, session: Session, *, material_id: str, payload: MaterialUpdateRequest
    ) -> LearningMaterial:
        material = self.get_material(session, material_id=material_id)
        if payload.title is not None:
            material.title = payload.title
        if payload.topic is not None:
            material.topic = payload.topic
        if payload.difficulty is not None:
            material.difficulty = payload.difficulty
        if payload.content is not None:
            material.content = payload.content
        if payload.sample_sql is not None:
            material.sample_sql = payload.sample_sql
        if payload.status is not None:
            material.status = payload.status

        session.commit()
        session.refresh(material)
        return material

    def delete_material(self, session: Session, *, material_id: str) -> None:
        material = self.get_material(session, material_id=material_id)
        session.delete(material)
        session.commit()
