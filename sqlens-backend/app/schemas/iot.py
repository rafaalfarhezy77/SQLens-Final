from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_serializer

IoTStatus = Literal["normal", "warning", "offline"]


class IoTReadingCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    device_id: str = Field(min_length=1, max_length=64, alias="deviceId")
    sensor_type: str = Field(min_length=1, max_length=64, alias="sensorType")
    value: float
    unit: str = Field(min_length=1, max_length=16)
    status: IoTStatus = "normal"
    recorded_at: datetime | None = Field(default=None, alias="recordedAt")


class IoTReadingResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    id: str
    device_id: str = Field(alias="deviceId")
    sensor_type: str = Field(alias="sensorType")
    value: float
    unit: str
    status: IoTStatus
    recorded_at: datetime = Field(alias="recordedAt")

    @field_serializer("recorded_at")
    def serialize_recorded_at(self, dt: datetime, _info) -> str:
        if dt.tzinfo is not None:
            utc_dt = dt.astimezone(timezone.utc)
            return utc_dt.strftime("%Y-%m-%dT%H:%M:%SZ")
        return f"{dt.isoformat()}Z"


class IoTReadingListResponse(BaseModel):
    items: list[IoTReadingResponse]
