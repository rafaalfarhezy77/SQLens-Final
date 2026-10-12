"""IoT Telemetry Simulator for SQLens.

Simulates sensor telemetry from classroom/lab IoT devices (e.g. ESP32, environmental sensors)
and records them into the SQLens database.
"""

from datetime import datetime, timezone
import random
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db.bootstrap import bootstrap
from app.db.session import SessionLocal
from app.schemas.iot import IoTReadingCreateRequest
from app.services.iot import IoTService

SAMPLE_DEVICES = [
    {"deviceId": "esp32-lab-01", "sensorType": "Temperature", "unit": "°C", "min": 22.0, "max": 28.5},
    {"deviceId": "esp32-lab-01", "sensorType": "Humidity", "unit": "%", "min": 50.0, "max": 75.0},
    {"deviceId": "esp32-server-room", "sensorType": "Temperature", "unit": "°C", "min": 18.0, "max": 24.0},
    {"deviceId": "esp32-server-room", "sensorType": "Air Quality", "unit": "AQI", "min": 15.0, "max": 45.0},
    {"deviceId": "esp32-classroom-a", "sensorType": "Noise Level", "unit": "dB", "min": 35.0, "max": 65.0},
]


def run_simulation(count: int = 10) -> None:
    bootstrap()
    db = SessionLocal()
    service = IoTService(db)

    print(f"Simulating {count} IoT sensor readings...")
    for _ in range(count):
        device = random.choice(SAMPLE_DEVICES)
        val = round(random.uniform(device["min"], device["max"]), 1)
        status = "normal"
        if "Temperature" in device["sensorType"] and val > 27.5:
            status = "warning"
        elif "Air Quality" in device["sensorType"] and val > 40.0:
            status = "warning"

        reading = service.record_reading(
            IoTReadingCreateRequest(
                deviceId=device["deviceId"],
                sensorType=device["sensorType"],
                value=val,
                unit=device["unit"],
                status=status,
                recordedAt=datetime.now(timezone.utc),
            )
        )
        print(f"Recorded: {reading.device_id} | {reading.sensor_type}: {reading.value} {reading.unit} [{reading.status}]")

    db.close()
    print("IoT simulation complete.")


if __name__ == "__main__":
    run_simulation(count=10)
