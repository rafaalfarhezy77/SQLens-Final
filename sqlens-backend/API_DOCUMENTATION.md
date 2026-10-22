# 📘 SQLens API Documentation

**Base URL:** `https://<host>/v1`
**Framework:** FastAPI `0.1.0`
**Content-Type:** `application/json`

---

## 📑 Daftar Isi

- [Autentikasi](#autentikasi)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Auth](#1-auth)
  - [Query Execution](#2-query-execution)
  - [Query History](#3-query-history)
  - [Datasets](#4-datasets)
  - [Custom Datasets](#5-custom-datasets)
  - [IoT](#6-iot)
  - [Lecturer](#7-lecturer)
  - [Materials](#8-materials)

---

## 🔐 Autentikasi

SQLens mendukung dua mekanisme autentikasi (**Dual-Mode Authentication**):

### 1. Klien Mobile (Flutter) — HTTP Bearer Token (JWT)
Setiap request dari aplikasi Flutter menyertakan token JWT standar pada header `Authorization`:
```http
Authorization: Bearer <access_token>
```
Token diperoleh saat memanggil endpoint `POST /v1/auth/login` atau `POST /v1/auth/register`. Token JWT memiliki masa berlaku 7 hari dan berisi identitas pengguna (`sub`) serta peran pengguna (`role`).

### 2. Website Utama (Next.js) — BFF Signed Identity
Website Next.js menggunakan mekanisme server-side **BFF Signed Identity**. Setiap request dari server Next.js ke FastAPI menyertakan 3 header:

| Header | Tipe | Deskripsi |
|---|---|---|
| `x-sqlens-user-id` | `string` | ID pengguna yang sedang login |
| `x-sqlens-bff-timestamp` | `string` | Unix timestamp saat request dibuat (dalam detik) |
| `x-sqlens-bff-signature` | `string` | HMAC-SHA256 signature dari `{timestamp}.{user_id}` menggunakan `BFF_SHARED_SECRET` |

> [!IMPORTANT]
> Signature BFF memiliki masa berlaku **300 detik (5 menit)** dari waktu pembuatan.

**Contoh Header BFF:**
```
x-sqlens-user-id: usr_abc123
x-sqlens-bff-timestamp: 1697712000
x-sqlens-bff-signature: a1b2c3d4e5f6...
```

---

## ⚠️ Error Handling

### Format Error Standar

Semua error menggunakan format JSON yang konsisten:

```json
{
  "code": "ERROR_CODE",
  "message": "Pesan error yang deskriptif.",
  "fieldErrors": {
    "field_name": ["Pesan validasi 1", "Pesan validasi 2"]
  }
}
```

### Kode Status HTTP

| Status Code | Deskripsi |
|---|---|
| `200` | Berhasil |
| `201` | Resource berhasil dibuat |
| `204` | Berhasil tanpa konten (delete) |
| `401` | Tidak terautentikasi / signature tidak valid |
| `422` | Validasi input gagal |
| `400` / `403` / `404` | Business logic error |

### Error Response Validasi (422)

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Permintaan tidak valid.",
  "fieldErrors": {
    "email": ["Alamat email tidak valid."],
    "password": ["String should have at least 6 characters"]
  }
}
```

---

## 📡 Endpoints

---

### Health Check

#### `GET /health`

Memeriksa status API server.

**Autentikasi:** Tidak diperlukan

**Response `200 OK`:**
```json
{
  "status": "ok"
}
```

---

### 1. Auth

Endpoint untuk registrasi, login, dan manajemen profil pengguna.

---

#### 1.1 `POST /v1/auth/register`

Mendaftarkan pengguna baru.

**Autentikasi:** Tidak diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `email` | `string` | ✅ | min: 3, max: 320, harus mengandung `@` | Alamat email pengguna |
| `password` | `string` | ✅ | min: 6, max: 128 | Kata sandi |
| `name` | `string` | ✅ | min: 2, max: 120 | Nama lengkap |
| `role` | `string` | ❌ | `"mahasiswa"` \| `"dosen"` | Role pengguna (default: `"mahasiswa"`) |

**Contoh Request:**
```json
{
  "email": "john@university.ac.id",
  "password": "secret123",
  "name": "John Doe",
  "role": "mahasiswa"
}
```

**Response `201 Created`:**
```json
{
  "id": "usr_abc123",
  "name": "John Doe",
  "email": "john@university.ac.id",
  "role": "mahasiswa"
}
```

---

#### 1.2 `POST /v1/auth/login`

Login pengguna yang sudah terdaftar.

**Autentikasi:** Tidak diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `email` | `string` | ✅ | min: 3, max: 320 | Alamat email |
| `password` | `string` | ✅ | min: 6, max: 128 | Kata sandi |

**Contoh Request:**
```json
{
  "email": "john@university.ac.id",
  "password": "secret123"
}
```

**Response `200 OK`:**
```json
{
  "id": "usr_abc123",
  "name": "John Doe",
  "email": "john@university.ac.id",
  "role": "mahasiswa",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "bearer"
}
```

---

#### 1.3 `PATCH /v1/auth/profile`

Memperbarui profil pengguna.

**Autentikasi:** ✅ Diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `name` | `string` | ✅ | min: 2, max: 120 | Nama baru |
| `avatarUrl` | `string \| null` | ❌ | — | URL avatar (opsional) |

**Contoh Request:**
```json
{
  "name": "John Updated",
  "avatarUrl": "https://example.com/avatar.png"
}
```

**Response `200 OK`:**
```json
{
  "id": "usr_abc123",
  "name": "John Updated",
  "email": "john@university.ac.id",
  "role": "mahasiswa"
}
```

---

### 2. Query Execution

Endpoint untuk mengeksekusi query SQL dan mendapatkan hasil beserta langkah-langkah pemrosesan edukatif.

---

#### 2.1 `POST /v1/query-executions`

Mengeksekusi query SQL dan mengembalikan hasil beserta visualisasi langkah-langkah pemrosesan.

**Autentikasi:** ✅ Diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `query` | `string` | ✅ | min: 5, max: 500 | Query SQL yang akan dieksekusi |

**Contoh Request:**
```json
{
  "query": "SELECT s.name, sc.course, sc.score FROM students s JOIN scores sc ON s.id = sc.student_id WHERE sc.score > 80"
}
```

**Response `200 OK` (Success):**
```json
{
  "status": "success",
  "query": "SELECT s.name, sc.course, sc.score FROM students s JOIN scores sc ON s.id = sc.student_id WHERE sc.score > 80",
  "executionTimeMs": 12.5,
  "columns": ["name", "course", "score"],
  "rows": [
    { "name": "Alice", "course": "Database", "score": 95 },
    { "name": "Bob", "course": "Algorithm", "score": 88 }
  ],
  "totalRows": 2,
  "steps": [
    {
      "stepNumber": 1,
      "clause": "FROM",
      "title": "Memuat Tabel",
      "badge": "FROM",
      "description": "Membaca data dari tabel students",
      "explanation": "Langkah pertama adalah memuat semua baris dari tabel sumber.",
      "rowsBeforeCount": 0,
      "rowsAfterCount": 10,
      "rowEvaluations": [
        {
          "id": "row_1",
          "data": { "id": 1, "name": "Alice", "major": "CS" },
          "status": "source",
          "statusText": "Dimuat",
          "reason": "Baris dimuat dari tabel students."
        }
      ],
      "joinDetails": null,
      "nodeId": "node_1",
      "nodeType": "source",
      "parentIds": null,
      "operationExpression": null
    }
  ]
}
```

**Response Error (misalnya `400 Bad Request`):**
```json
{
  "status": "error",
  "error": {
    "code": "FORBIDDEN_STATEMENT",
    "message": "Hanya pernyataan SELECT yang diizinkan."
  }
}
```

**Schema Detail — `steps[]` (QueryProcessingStep):**

| Field | Tipe | Deskripsi |
|---|---|---|
| `stepNumber` | `integer` | Nomor urut langkah (dimulai dari 1) |
| `clause` | `string` | Klausa SQL yang sedang diproses (FROM, JOIN, WHERE, dll.) |
| `title` | `string` | Judul langkah |
| `badge` | `string` | Label badge untuk UI |
| `description` | `string` | Deskripsi singkat langkah |
| `explanation` | `string` | Penjelasan edukatif tentang langkah ini |
| `rowsBeforeCount` | `integer` | Jumlah baris sebelum langkah |
| `rowsAfterCount` | `integer` | Jumlah baris setelah langkah |
| `rowEvaluations` | `array` | Evaluasi per-baris (lihat tabel di bawah) |
| `joinDetails` | `object \| null` | Detail JOIN jika langkah ini adalah operasi JOIN |
| `nodeId` | `string \| null` | ID node untuk visualisasi graf |
| `nodeType` | `string \| null` | Tipe node untuk visualisasi graf |
| `parentIds` | `array \| null` | ID parent nodes |
| `operationExpression` | `string \| null` | Ekspresi operasi |

**Schema Detail — `rowEvaluations[]` (QueryStepRow):**

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | `string` | ID unik baris |
| `data` | `object` | Data baris (key-value) |
| `status` | `string` | Status baris: `"keep"`, `"filtered"`, `"source"`, atau `"joined"` |
| `statusText` | `string` | Teks status untuk ditampilkan |
| `reason` | `string` | Alasan mengapa baris mendapat status tersebut |

**Schema Detail — `joinDetails` (JoinVisualizationDetails):**

| Field | Tipe | Deskripsi |
|---|---|---|
| `leftTable` | `string` | Nama tabel kiri |
| `rightTable` | `string` | Nama tabel kanan |
| `leftKey` | `string` | Kolom kunci tabel kiri |
| `rightKey` | `string` | Kolom kunci tabel kanan |
| `joinType` | `string` | Tipe JOIN (INNER, LEFT, RIGHT, dll.) |

---

### 3. Query History

Endpoint untuk melihat dan mengelola riwayat query pengguna.

---

#### 3.1 `GET /v1/query-history`

Mengambil daftar riwayat query pengguna.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "qh_abc123",
      "query": "SELECT * FROM students",
      "status": "success",
      "executedAt": "2024-10-19T10:30:00Z",
      "executionTimeMs": 8.2,
      "rowCount": 10
    },
    {
      "id": "qh_def456",
      "query": "SELECT * FROM nonexistent",
      "status": "error",
      "executedAt": "2024-10-19T10:25:00Z",
      "executionTimeMs": null,
      "rowCount": null
    }
  ]
}
```

**Schema — `items[]` (QueryHistoryItemResponse):**

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | `string` | ID unik riwayat |
| `query` | `string` | Query SQL yang dieksekusi |
| `status` | `string` | `"success"` \| `"error"` |
| `executedAt` | `string (datetime)` | Waktu eksekusi (ISO 8601) |
| `executionTimeMs` | `float \| null` | Waktu eksekusi dalam milidetik |
| `rowCount` | `integer \| null` | Jumlah baris hasil |

---

#### 3.2 `DELETE /v1/query-history`

Menghapus semua riwayat query pengguna.

**Autentikasi:** ✅ Diperlukan

**Response `204 No Content`:** _(tanpa body)_

---

#### 3.3 `DELETE /v1/query-history/{history_id}`

Menghapus satu riwayat query berdasarkan ID.

**Autentikasi:** ✅ Diperlukan

**Path Parameter:**

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `history_id` | `string` | ID riwayat query yang akan dihapus |

**Response `204 No Content`:** _(tanpa body)_

---

### 4. Datasets

Endpoint untuk mengakses dataset edukatif bawaan.

---

#### 4.1 `GET /v1/datasets/educational`

Mengambil dataset edukatif bawaan (tabel `students` dan `scores`).

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "tables": [
    {
      "name": "students",
      "columns": ["id", "name", "major"],
      "rows": [
        { "id": 1, "name": "Alice", "major": "Computer Science" },
        { "id": 2, "name": "Bob", "major": "Mathematics" }
      ],
      "relationship": "students.id adalah primary key."
    },
    {
      "name": "scores",
      "columns": ["id", "student_id", "course", "score", "grade"],
      "rows": [
        { "id": 1, "student_id": 1, "course": "Database", "score": 95, "grade": "A" }
      ],
      "relationship": "scores.student_id merujuk ke students.id."
    }
  ]
}
```

---

### 5. Custom Datasets

Endpoint untuk mengelola dataset kustom pengguna.

---

#### 5.1 `GET /v1/datasets/custom`

Mengecek apakah pengguna memiliki dataset kustom dan mengambil datanya.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "has_custom_dataset": true,
  "tables": [
    {
      "name": "products",
      "columns": ["id", "name", "price"],
      "rows": [
        { "id": 1, "name": "Laptop", "price": 15000000 }
      ],
      "relationship": null
    }
  ]
}
```

---

#### 5.2 `POST /v1/datasets/custom/upload-csv`

Mengimpor dataset dari file CSV.

**Autentikasi:** ✅ Diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `files` | `array` | ✅ | min: 1, max: 5 item | Daftar file CSV |
| `files[].filename` | `string` | ✅ | min: 1 karakter | Nama file |
| `files[].content` | `string` | ❌ | — | Isi konten CSV (default: kosong) |

**Contoh Request:**
```json
{
  "files": [
    {
      "filename": "products.csv",
      "content": "id,name,price\n1,Laptop,15000000\n2,Mouse,150000"
    }
  ]
}
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "message": "Berhasil mengimpor 1 tabel dari file CSV.",
  "tables": [
    {
      "name": "products",
      "columns": ["id", "name", "price"],
      "rows": [
        { "id": "1", "name": "Laptop", "price": "15000000" }
      ],
      "relationship": null
    }
  ]
}
```

---

#### 5.3 `POST /v1/datasets/custom/upload-sql`

Mengimpor dataset dari skrip SQL (CREATE TABLE + INSERT).

**Autentikasi:** ✅ Diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `sql` | `string` | ✅ | min: 1 karakter | Skrip SQL untuk membuat dan mengisi tabel |

**Contoh Request:**
```json
{
  "sql": "CREATE TABLE products (id INT PRIMARY KEY, name VARCHAR(100), price INT); INSERT INTO products VALUES (1, 'Laptop', 15000000);"
}
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "message": "Berhasil mengimpor 1 tabel dari skrip SQL.",
  "tables": [
    {
      "name": "products",
      "columns": ["id", "name", "price"],
      "rows": [
        { "id": 1, "name": "Laptop", "price": 15000000 }
      ],
      "relationship": null
    }
  ]
}
```

---

#### 5.4 `DELETE /v1/datasets/custom`

Menghapus dataset kustom dan mengembalikan ke dataset bawaan.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "status": "success",
  "message": "Dataset kustom berhasil dihapus dan dikembalikan ke bawaan."
}
```

---

### 6. IoT

Endpoint untuk integrasi data sensor IoT.

---

#### 6.1 `POST /v1/iot/telemetry`

Merekam data telemetri dari perangkat IoT.

**Autentikasi:** Tidak diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `deviceId` | `string` | ✅ | min: 1, max: 64 | ID perangkat IoT |
| `sensorType` | `string` | ✅ | min: 1, max: 64 | Tipe sensor (e.g. `"temperature"`, `"humidity"`) |
| `value` | `float` | ✅ | — | Nilai pembacaan sensor |
| `unit` | `string` | ✅ | min: 1, max: 16 | Satuan pengukuran (e.g. `"°C"`, `"%"`) |
| `status` | `string` | ❌ | `"normal"` \| `"warning"` \| `"offline"` | Status perangkat (default: `"normal"`) |
| `recordedAt` | `string \| null` | ❌ | ISO 8601 datetime | Waktu perekaman (default: waktu server) |

**Contoh Request:**
```json
{
  "deviceId": "sensor-001",
  "sensorType": "temperature",
  "value": 28.5,
  "unit": "°C",
  "status": "normal",
  "recordedAt": "2024-10-19T10:30:00Z"
}
```

**Response `201 Created`:**
```json
{
  "id": "iot_abc123",
  "deviceId": "sensor-001",
  "sensorType": "temperature",
  "value": 28.5,
  "unit": "°C",
  "status": "normal",
  "recordedAt": "2024-10-19T10:30:00Z"
}
```

---

#### 6.2 `GET /v1/iot/readings`

Mengambil daftar pembacaan sensor terbaru.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "iot_abc123",
      "deviceId": "sensor-001",
      "sensorType": "temperature",
      "value": 28.5,
      "unit": "°C",
      "status": "normal",
      "recordedAt": "2024-10-19T10:30:00Z"
    }
  ]
}
```

---

### 7. Lecturer

Endpoint untuk dosen melihat aktivitas dan progres mahasiswa.

---

#### 7.1 `GET /v1/lecturer/activities`

Mengambil daftar aktivitas query mahasiswa.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "act_abc123",
      "studentName": "Alice",
      "email": "alice@university.ac.id",
      "query": "SELECT * FROM students",
      "status": "success",
      "occurredAt": "2024-10-19T10:30:00Z",
      "count": 5
    }
  ]
}
```

**Schema — `items[]` (StudentActivityResponse):**

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | `string` | ID unik aktivitas |
| `studentName` | `string` | Nama mahasiswa |
| `email` | `string` | Email mahasiswa |
| `query` | `string` | Query yang dieksekusi |
| `status` | `string` | `"success"` \| `"error"` |
| `occurredAt` | `string` | Waktu aktivitas |
| `count` | `integer` | Jumlah eksekusi |

---

#### 7.2 `GET /v1/lecturer/progress`

Mengambil data progres belajar mahasiswa.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "usr_abc123",
      "studentName": "Alice",
      "successfulQueries": 42,
      "progressPercent": 75,
      "latestActivity": "2024-10-19T10:30:00Z"
    }
  ]
}
```

**Schema — `items[]` (StudentProgressResponse):**

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | `string` | ID mahasiswa |
| `studentName` | `string` | Nama mahasiswa |
| `successfulQueries` | `integer` | Jumlah query berhasil |
| `progressPercent` | `integer` | Persentase progres (0-100) |
| `latestActivity` | `string \| null` | Waktu aktivitas terakhir |

---

### 8. Materials

Endpoint untuk mengelola materi pembelajaran SQL (CRUD).

---

#### 8.1 `GET /v1/materials`

Mengambil daftar semua materi pembelajaran.

**Autentikasi:** ✅ Diperlukan

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "mat_abc123",
      "title": "Pengenalan SELECT",
      "topic": "SQL",
      "difficulty": "Dasar",
      "content": "Materi tentang penggunaan SELECT statement...",
      "sampleSql": "SELECT * FROM students;",
      "status": "published"
    }
  ]
}
```

---

#### 8.2 `GET /v1/materials/{material_id}`

Mengambil detail satu materi berdasarkan ID.

**Autentikasi:** ✅ Diperlukan

**Path Parameter:**

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `material_id` | `string` | ID materi |

**Response `200 OK`:**
```json
{
  "id": "mat_abc123",
  "title": "Pengenalan SELECT",
  "topic": "SQL",
  "difficulty": "Dasar",
  "content": "Materi tentang penggunaan SELECT statement...",
  "sampleSql": "SELECT * FROM students;",
  "status": "published"
}
```

---

#### 8.3 `POST /v1/materials`

Membuat materi pembelajaran baru.

**Autentikasi:** ✅ Diperlukan

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `title` | `string` | ✅ | min: 3, max: 255 | Judul materi |
| `topic` | `string` | ❌ | min: 2, max: 100 | Topik (default: `"SQL"`) |
| `difficulty` | `string` | ❌ | `"Dasar"` \| `"Menengah"` \| `"Lanjut"` | Tingkat kesulitan (default: `"Dasar"`) |
| `content` | `string` | ❌ | min: 5 | Konten materi (default: `"Materi pembelajaran SQL."`) |
| `sampleSql` | `string` | ❌ | min: 6 | Contoh query SQL (default: `"SELECT * FROM students;"`) |
| `status` | `string` | ❌ | `"draft"` \| `"published"` | Status publikasi (default: `"draft"`) |

**Contoh Request:**
```json
{
  "title": "Pengenalan JOIN",
  "topic": "SQL",
  "difficulty": "Menengah",
  "content": "JOIN digunakan untuk menggabungkan data dari dua tabel...",
  "sampleSql": "SELECT s.name, sc.course FROM students s JOIN scores sc ON s.id = sc.student_id;",
  "status": "published"
}
```

**Response `201 Created`:**
```json
{
  "id": "mat_def456",
  "title": "Pengenalan JOIN",
  "topic": "SQL",
  "difficulty": "Menengah",
  "content": "JOIN digunakan untuk menggabungkan data dari dua tabel...",
  "sampleSql": "SELECT s.name, sc.course FROM students s JOIN scores sc ON s.id = sc.student_id;",
  "status": "published"
}
```

---

#### 8.4 `PUT /v1/materials/{material_id}`

Memperbarui materi pembelajaran (semua field opsional).

**Autentikasi:** ✅ Diperlukan

**Path Parameter:**

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `material_id` | `string` | ID materi yang akan diperbarui |

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `title` | `string \| null` | ❌ | min: 3, max: 255 | Judul baru |
| `topic` | `string \| null` | ❌ | min: 2, max: 100 | Topik baru |
| `difficulty` | `string \| null` | ❌ | `"Dasar"` \| `"Menengah"` \| `"Lanjut"` | Tingkat kesulitan baru |
| `content` | `string \| null` | ❌ | min: 5 | Konten baru |
| `sampleSql` | `string \| null` | ❌ | min: 6 | Contoh SQL baru |
| `status` | `string \| null` | ❌ | `"draft"` \| `"published"` | Status baru |

**Contoh Request:**
```json
{
  "title": "Pengenalan JOIN (Updated)",
  "status": "published"
}
```

**Response `200 OK`:**
```json
{
  "id": "mat_def456",
  "title": "Pengenalan JOIN (Updated)",
  "topic": "SQL",
  "difficulty": "Menengah",
  "content": "JOIN digunakan untuk menggabungkan data dari dua tabel...",
  "sampleSql": "SELECT s.name, sc.course FROM students s JOIN scores sc ON s.id = sc.student_id;",
  "status": "published"
}
```

---

#### 8.5 `DELETE /v1/materials/{material_id}`

Menghapus materi pembelajaran.

**Autentikasi:** ✅ Diperlukan (Khusus Dosen)

**Path Parameter:**

| Parameter | Tipe | Deskripsi |
|---|---|---|
| `material_id` | `string` | ID materi yang akan dihapus |

**Response `204 No Content`:** _(tanpa body)_

---

### 9. AI Tutor

Endpoint bersama untuk asisten pedagogis penalaran query (Socratic Tutor) yang dapat diakses oleh website maupun klien mobile.

---

#### 9.1 `POST /v1/ai-tutor/ask`

Mengirim pertanyaan mahasiswa atau konteks kueri SQL untuk memperoleh penjelasan pedagogis, petunjuk (hint), konsep SQL terkait, dan tahapan penalaran alur data tanpa memberikan spoiler jawaban langsung.

**Autentikasi:** ✅ Diperlukan (Bearer Token atau BFF HMAC)

**Request Body:**

| Field | Tipe | Wajib | Validasi | Deskripsi |
|---|---|---|---|---|
| `prompt` | `string` | ✅ | min: 3, max: 2000 | Pertanyaan atau kendala yang dihadapi mahasiswa |
| `query` | `string \| null` | ❌ | max: 1000 | Kueri SQL yang sedang dipelajari |
| `context` | `string \| null` | ❌ | max: 100 | Konteks modul/topik pembelajaran |

**Contoh Request:**
```json
{
  "prompt": "Mengapa Citra Dewi tidak muncul pada tabel hasil akhir query?",
  "query": "SELECT * FROM scores WHERE score >= 80;",
  "context": "where-filtering"
}
```

**Response `200 OK`:**
```json
{
  "explanation": "Citra Dewi tereliminasi pada evaluasi klausa WHERE karena skornya tidak memenuhi kondisi >= 80.",
  "hint": "Periksa nilai kolom score pada baris Citra Dewi di tabel scores.",
  "sqlConcept": "Row Filtering with WHERE",
  "reasoning": [
    "1. Memuat seluruh data dari tabel sumber.",
    "2. Mengevaluasi kondisi predikat boolean pada kolom score.",
    "3. Baris bernilai FALSE disingkirkan sebelum tahap proyeksi SELECT."
  ]
}
```

---

## 📊 Ringkasan Endpoint

| # | Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|---|
| — | `GET` | `/health` | ❌ | Health check |
| 1.1 | `POST` | `/v1/auth/register` | ❌ | Registrasi pengguna |
| 1.2 | `POST` | `/v1/auth/login` | ❌ | Login pengguna (menghasilkan JWT) |
| 1.3 | `PATCH` | `/v1/auth/profile` | ✅ | Update profil |
| 2.1 | `POST` | `/v1/query-executions` | ✅ | Eksekusi query SQL |
| 3.1 | `GET` | `/v1/query-history` | ✅ | Daftar riwayat query |
| 3.2 | `DELETE` | `/v1/query-history` | ✅ | Hapus semua riwayat |
| 3.3 | `DELETE` | `/v1/query-history/{history_id}` | ✅ | Hapus satu riwayat |
| 4.1 | `GET` | `/v1/datasets/educational` | ✅ | Dataset edukatif |
| 5.1 | `GET` | `/v1/datasets/custom` | ✅ | Info dataset kustom |
| 5.2 | `POST` | `/v1/datasets/custom/upload-csv` | ✅ | Upload CSV |
| 5.3 | `POST` | `/v1/datasets/custom/upload-sql` | ✅ | Upload SQL |
| 5.4 | `DELETE` | `/v1/datasets/custom` | ✅ | Reset dataset kustom |
| 6.1 | `POST` | `/v1/iot/telemetry` | ❌ | Rekam data IoT |
| 6.2 | `GET` | `/v1/iot/readings` | ✅ | Daftar pembacaan IoT |
| 7.1 | `GET` | `/v1/lecturer/activities` | ✅ (Dosen) | Aktivitas mahasiswa |
| 7.2 | `GET` | `/v1/lecturer/progress` | ✅ (Dosen) | Progres mahasiswa |
| 8.1 | `GET` | `/v1/materials` | ✅ | Daftar materi |
| 8.2 | `GET` | `/v1/materials/{material_id}` | ✅ | Detail materi |
| 8.3 | `POST` | `/v1/materials` | ✅ (Dosen) | Buat materi |
| 8.4 | `PUT` | `/v1/materials/{material_id}` | ✅ (Dosen) | Update materi |
| 8.5 | `DELETE` | `/v1/materials/{material_id}` | ✅ (Dosen) | Hapus materi |
| 9.1 | `POST` | `/v1/ai-tutor/ask` | ✅ | Asisten Socratic AI Tutor |

---

> [!NOTE]
> Dokumentasi ini di-generate dari source code repository [SQLens-Final](https://github.com/rafaalfarhezy77/SQLens-Final). Untuk melihat Swagger UI interaktif, jalankan server FastAPI dan akses `/docs` atau `/redoc`.
