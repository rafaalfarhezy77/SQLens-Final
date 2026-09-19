/** Development fixture only. Replace through typed BFF services when lecturer APIs exist. */
import type {
  Material,
  StudentActivity,
  StudentProgress,
} from "@/lib/api/contracts/lecturer";
import type { IoTReading } from "@/lib/api/contracts/iot";

export const DEMO_MATERIALS: Material[] = [
  {
    id: "mat-1",
    title: "SELECT dan Proyeksi",
    topic: "SELECT",
    difficulty: "Dasar",
    content: "Memilih kolom dari tabel pendidikan.",
    sampleSql: "SELECT name FROM students;",
    status: "published",
  },
];
export const DEMO_ACTIVITIES: StudentActivity[] = [
  {
    id: "act-1",
    studentName: "Demo Mahasiswa",
    email: "demo.student@sqlens.local",
    query: "SELECT name FROM students;",
    status: "success",
    occurredAt: "2026-01-15T08:00:00.000Z",
    count: 3,
  },
];
export const DEMO_PROGRESS: StudentProgress[] = [
  {
    id: "student-1",
    studentName: "Demo Mahasiswa",
    successfulQueries: 3,
    progressPercent: 67,
    latestActivity: "2026-01-15T08:00:00.000Z",
  },
];
export const DEMO_IOT_READINGS: IoTReading[] = [
  {
    id: "iot-1",
    deviceId: "sensor-lab-01",
    sensorType: "Suhu",
    value: 26.4,
    unit: "°C",
    recordedAt: "2026-01-15T08:00:00.000Z",
    status: "normal",
  },
];
