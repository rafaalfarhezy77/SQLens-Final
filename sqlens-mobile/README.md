# SQLens Mobile (Flutter)

Aplikasi klien mobile **SQLens — Database Query Tutor** berbasis Flutter (Dart) dengan gaya desain visual **Neo-Brutalism**, terintegrasi langsung dengan **FastAPI Backend (`sqlens-backend`)** menggunakan autentikasi **JWT Bearer Token**.

## Fitur Utama Mobile

1. **Multi-Studi Kasus & Database Bawaan:**
   - 🎓 **Sistem Akademik Kampus (`academic`):** Tabel `students`, `scores`, `courses`.
   - 🛒 **E-Commerce & Retail (`ecommerce`):** Tabel `customers`, `categories`, `products`, `orders`, `order_items`.
   - 📚 **Sirkulasi Perpustakaan (`library`):** Tabel `members`, `books`, `borrowings`, `fines`.
   - 👥 **Dataset Kelas Bersama Dosen:** Mengakses database tugas praktikum yang dibagikan oleh Dosen.
   - 📋 **Soal Tantangan SQL & Petunjuk (Hints):** Kerjakan soal latihan SQL interaktif dengan 1 kali klik.

2. **Fitur Upload Database Kustom (User / Dosen / Mahasiswa):**
   - **Upload CSV:** Impor data CSV (otomatis inferensi tipe data PostgreSQL).
   - **Upload Skrip SQL:** Eksekusi skrip `CREATE TABLE` dan `INSERT INTO` ke skema sandbox kustom.
   - **Reset Database:** Kemudahan mereset ke dataset bawaan kapan saja.

3. **Viewer Skema & Data Tabel Mobile:**
   - Pratinjau tabel, struktur kolom, dan 10 baris data riil secara vertikal dan horizontal.

4. **SQL Editor & Quick Toolbar:**
   - Shortcut klausa cepat (`SELECT`, `FROM`, `WHERE`, `JOIN`, dll.).
   - Visualisasi tahapan data step-by-step (*FROM $\rightarrow$ WHERE $\rightarrow$ JOIN $\rightarrow$ SELECT*).
   - Tabel hasil eksekusi query responsif.

5. **AI Tutor & Riwayat Query:**
   - Bimbingan pedagogis Socratic berbahasa Indonesia.
   - Riwayat eksekusi query tersinkronisasi dengan server PostgreSQL.

## Cara Menjalankan

```bash
cd sqlens-mobile
flutter pub get
flutter run
```

Konfigurasikan alamat server backend di tab **Profil Akun** (mendukung Cloud Render, Emulator Android `10.0.2.2:8000`, atau Local Wi-Fi).
