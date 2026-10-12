from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.models.iot import IoTReading
from app.schemas.iot import IoTReadingCreateRequest


class IoTService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def record_reading(self, payload: IoTReadingCreateRequest) -> IoTReading:
        kwargs = {
            "device_id": payload.device_id,
            "sensor_type": payload.sensor_type,
            "value": payload.value,
            "unit": payload.unit,
            "status": payload.status,
        }
        if payload.recorded_at is not None:
            kwargs["recorded_at"] = payload.recorded_at

        reading = IoTReading(**kwargs)
        self.db.add(reading)
        self.db.commit()
        self.db.refresh(reading)
        return reading

    def get_latest_readings(self, limit: int = 50) -> list[IoTReading]:
        query = select(IoTReading).order_by(desc(IoTReading.recorded_at)).limit(limit)
        return list(self.db.scalars(query).all())
