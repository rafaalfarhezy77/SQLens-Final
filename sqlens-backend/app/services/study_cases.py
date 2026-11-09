from datetime import date, datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.errors import PublicApiError
from app.schemas.study_cases import (
    SampleQuery,
    StudyCaseChallenge,
    StudyCaseDetail,
    StudyCaseSummary,
    StudyCaseTable,
)


def _json_value(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, UUID):
        return str(value)
    return str(value)


STUDY_CASES_CATALOG: dict[str, dict[str, Any]] = {
    "academic": {
        "id": "academic",
        "title": "Sistem Akademik Kampus",
        "category": "Pendidikan",
        "difficulty": "Dasar",
        "description": "Basis data akademik universitas yang mencatat data profil mahasiswa, nilai mata kuliah per semester, dan informasi kurikulum program studi.",
        "table_names": ["students", "scores", "courses"],
        "table_descriptions": {
            "students": "Menyimpan data identitas mahasiswa (id, name, major).",
            "scores": "Menyimpan perolehan nilai mahasiswa pada tiap mata kuliah (id, student_id, course, score, grade).",
            "courses": "Menyimpan katalog mata kuliah dan bobot SKS (code, title, credits).",
        },
        "sample_queries": [
            {
                "title": "Daftar Mahasiswa Informatika",
                "query": "SELECT id, name, major FROM students WHERE major = 'Informatika';",
                "explanation": "Menampilkan data mahasiswa yang berada di jurusan Informatika.",
            },
            {
                "title": "Nilai Mahasiswa & Kursus (JOIN)",
                "query": "SELECT s.name, sc.course, sc.score, sc.grade FROM students s JOIN scores sc ON s.id = sc.student_id WHERE sc.score >= 80;",
                "explanation": "Menggabungkan tabel mahasiswa dan nilai untuk melihat siapa saja yang memperoleh nilai 80 ke atas.",
            },
            {
                "title": "Jumlah Mahasiswa per Jurusan",
                "query": "SELECT major, COUNT(*) AS total FROM students GROUP BY major;",
                "explanation": "Mengelompokkan data berdasarkan jurusan dan menghitung total mahasiswa.",
            },
        ],
        "challenges": [
            {
                "id": "acad-1",
                "title": "Filter Mahasiswa Berprestasi",
                "description": "Tampilkan nama mahasiswa, nama mata kuliah, dan nilai untuk mahasiswa yang memperoleh grade 'A'.",
                "difficulty": "Dasar",
                "hint": "Gunakan INNER JOIN antara tabel students dan scores dengan kondisi ON s.id = sc.student_id, lalu filter dengan WHERE sc.grade = 'A'.",
                "starterQuery": "SELECT s.name, sc.course, sc.score\nFROM students s\nJOIN scores sc ON s.id = sc.student_id\nWHERE sc.grade = 'A';",
            },
            {
                "id": "acad-2",
                "title": "Rata-rata Nilai per Mata Kuliah",
                "description": "Hitung nilai rata-rata yang diperoleh mahasiswa untuk setiap mata kuliah dan urutkan dari yang tertinggi.",
                "difficulty": "Menengah",
                "hint": "Gunakan fungsi agregasi AVG(score) dan klausa GROUP BY course ORDER BY rata_rata DESC.",
                "starterQuery": "SELECT course, ROUND(AVG(score), 2) AS rata_rata\nFROM scores\nGROUP BY course\nORDER BY rata_rata DESC;",
            },
        ],
    },
    "ecommerce": {
        "id": "ecommerce",
        "title": "E-Commerce & Transaksi Retail",
        "category": "Bisnis & E-Commerce",
        "difficulty": "Menengah",
        "description": "Basis data operasional ritel online yang memantau katalog produk, kategori barang, profil pelanggan, transaksi pemesanan, serta rincian pembelian.",
        "table_names": ["customers", "categories", "products", "orders", "order_items"],
        "table_descriptions": {
            "customers": "Daftar pelanggan terdaftar beserta alamat domisili (id, name, email, city).",
            "categories": "Kategori produk belanjaan (id, name, description).",
            "products": "Katalog produk barang dagangan dan stok gudang (id, name, category_id, price, stock).",
            "orders": "Riwayat transaksi pembelian pelanggan (id, customer_id, order_date, total_amount, status).",
            "order_items": "Rincian barang dalam suatu pesanan (id, order_id, product_id, quantity, unit_price).",
        },
        "sample_queries": [
            {
                "title": "Daftar Pelanggan Kota Jakarta",
                "query": "SELECT id, name, email, city FROM customers WHERE city = 'Jakarta';",
                "explanation": "Menampilkan seluruh pelanggan yang berdomisili di Jakarta.",
            },
            {
                "title": "Produk beserta Kategorinya",
                "query": "SELECT p.name AS nama_produk, c.name AS kategori, p.price, p.stock FROM products p JOIN categories c ON p.category_id = c.id;",
                "explanation": "Menggabungkan tabel produk dan kategori untuk menampilkan harga dan stok terkini.",
            },
            {
                "title": "Pesanan yang Sudah Lunas (PAID)",
                "query": "SELECT o.id AS order_id, c.name AS pelanggan, o.order_date, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.status = 'PAID';",
                "explanation": "Melihat daftar order berstatus PAID beserta nama pelanggan terkait.",
            },
        ],
        "challenges": [
            {
                "id": "ecom-1",
                "title": "Analisis Pendapatan per Pelanggan",
                "description": "Tampilkan nama pelanggan dan total uang yang telah dibayarkan untuk semua pesanan yang berstatus 'PAID'.",
                "difficulty": "Menengah",
                "hint": "Gabungkan customers dan orders, gunakan WHERE status = 'PAID', GROUP BY c.name, dan SUM(o.total_amount).",
                "starterQuery": "SELECT c.name, SUM(o.total_amount) AS total_belanja\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'PAID'\nGROUP BY c.name\nORDER BY total_belanja DESC;",
            },
            {
                "id": "ecom-2",
                "title": "Produk Terlaris Berdasarkan Kuantitas",
                "description": "Hitung berapa total unit yang terjual untuk setiap produk dari item pesanan.",
                "difficulty": "Lanjutan",
                "hint": "Gunakan JOIN antara products dan order_items, lalu hitung SUM(oi.quantity) GROUP BY p.name.",
                "starterQuery": "SELECT p.name, SUM(oi.quantity) AS total_terjual\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nGROUP BY p.name\nORDER BY total_terjual DESC;",
            },
        ],
    },
    "library": {
        "id": "library",
        "title": "Sirkulasi Buku Perpustakaan",
        "category": "Layanan Publik",
        "difficulty": "Dasar",
        "description": "Basis data sirkulasi perpustakaan kampus yang mencatat inventaris koleksi buku, data anggota mahasiswa/dosen, transaksi peminjaman, dan denda.",
        "table_names": ["members", "books", "borrowings", "fines"],
        "table_descriptions": {
            "members": "Data keanggotaan perpustakaan (id, member_no, name, faculty, joined_year).",
            "books": "Daftar buku dan jumlah ketersediaan fisik (id, isbn, title, author, published_year, total_copies).",
            "borrowings": "Catatan transaksi peminjaman buku (id, member_id, book_id, borrow_date, due_date, return_date, status).",
            "fines": "Catatan denda keterlambatan pengembalian buku (id, borrowing_id, amount, status, reason).",
        },
        "sample_queries": [
            {
                "title": "Buku Terbaru Terbitan 2020 ke Atas",
                "query": "SELECT id, title, author, published_year FROM books WHERE published_year >= 2020;",
                "explanation": "Menampilkan buku-buku baru dalam katalog perpustakaan.",
            },
            {
                "title": "Buku yang Sedang Dipinjam",
                "query": "SELECT m.name AS peminjam, b.title AS judul_buku, bw.due_date FROM borrowings bw JOIN members m ON bw.member_id = m.id JOIN books b ON bw.book_id = b.id WHERE bw.status = 'BORROWED';",
                "explanation": "Memeriksa anggota yang sedang meminjam buku beserta batas waktu pengembaliannya.",
            },
            {
                "title": "Total Denda yang Terkumpul",
                "query": "SELECT status, SUM(amount) AS total_denda FROM fines GROUP BY status;",
                "explanation": "Menghitung total denda berdasarkan status pelunasan.",
            },
        ],
        "challenges": [
            {
                "id": "lib-1",
                "title": "Daftar Anggota dengan Denda",
                "description": "Tampilkan nama anggota perpustakaan, judul buku yang dipinjam, dan jumlah denda yang dikenakan.",
                "difficulty": "Dasar",
                "hint": "Lakukan JOIN dari members ke borrowings lalu ke fines dan books.",
                "starterQuery": "SELECT m.name, b.title, f.amount, f.reason\nFROM members m\nJOIN borrowings bw ON m.id = bw.member_id\nJOIN books b ON bw.book_id = b.id\nJOIN fines f ON bw.id = f.borrowing_id;",
            },
        ],
    },
}


class StudyCaseService:
    def list_study_cases(self) -> list[StudyCaseSummary]:
        results: list[StudyCaseSummary] = []
        for case in STUDY_CASES_CATALOG.values():
            results.append(
                StudyCaseSummary(
                    id=case["id"],
                    title=case["title"],
                    category=case["category"],
                    difficulty=case["difficulty"],
                    description=case["description"],
                    tableNames=case["table_names"],
                    sampleQueries=[SampleQuery(**q) for q in case["sample_queries"]],
                    challengesCount=len(case["challenges"]),
                )
            )
        return results

    def get_study_case(self, session: Session, case_id: str) -> StudyCaseDetail:
        case = STUDY_CASES_CATALOG.get(case_id.lower().strip())
        if not case:
            raise PublicApiError(
                status_code=404,
                code="STUDY_CASE_NOT_FOUND",
                message=f"Studi kasus dengan ID '{case_id}' tidak ditemukan.",
            )

        tables: list[StudyCaseTable] = []
        for tbl_name in case["table_names"]:
            desc = case["table_descriptions"].get(tbl_name, f"Tabel {tbl_name}")
            try:
                result = session.execute(text(f"SELECT * FROM {tbl_name} LIMIT 10"))
                columns = list(result.keys())
                rows = [
                    {col: _json_value(val) for col, val in row.items()}
                    for row in result.mappings()
                ]
            except Exception:
                columns = []
                rows = []

            tables.append(
                StudyCaseTable(
                    name=tbl_name,
                    description=desc,
                    columns=columns,
                    sampleRows=rows,
                )
            )

        return StudyCaseDetail(
            id=case["id"],
            title=case["title"],
            category=case["category"],
            difficulty=case["difficulty"],
            description=case["description"],
            tableNames=case["table_names"],
            sampleQueries=[SampleQuery(**q) for q in case["sample_queries"]],
            challengesCount=len(case["challenges"]),
            tables=tables,
            challenges=[StudyCaseChallenge(**c) for c in case["challenges"]],
        )
