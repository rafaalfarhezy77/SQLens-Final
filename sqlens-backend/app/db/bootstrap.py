"""Create the local development schema and deterministic educational dataset."""

from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models import IoTReading, LearningMaterial, QueryHistory, SharedDataset, User  # noqa: F401 - registers model metadata


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
        """
        CREATE TABLE IF NOT EXISTS courses (
          code VARCHAR(20) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          credits INTEGER NOT NULL
        )
        """,
        """
        INSERT INTO courses (code, title, credits) VALUES
          ('CS101', 'Basis Data', 3),
          ('CS102', 'Algoritma', 4),
          ('IS201', 'Sistem Informasi Manajemen', 3),
          ('CE301', 'Arsitektur Komputer', 3)
        ON CONFLICT (code) DO NOTHING
        """,
        """
        CREATE OR REPLACE VIEW mahasiswa AS 
        SELECT id, name AS nama, major AS jurusan FROM students
        """,
        """
        CREATE OR REPLACE VIEW nilai AS 
        SELECT id, student_id AS mahasiswa_id, course AS matakuliah, score AS nilai, grade FROM scores
        """,
        """
        CREATE OR REPLACE VIEW matakuliah AS 
        SELECT code AS kode, title AS nama_mata_kuliah, credits AS sks FROM courses
        """,
        # --- STUDI KASUS 2: E-COMMERCE & RETAIL ONLINE ---
        """
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description VARCHAR(255) NOT NULL
        )
        """,
        """
        INSERT INTO categories (id, name, description) VALUES
          (1, 'Elektronik', 'Perangkat gadget, komputer, dan aksesoris'),
          (2, 'Pakaian', 'Busana pria, wanita, dan aksesoris fashion'),
          (3, 'Buku', 'Buku teks, referensi akademik, dan fiksi')
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category_id INTEGER NOT NULL REFERENCES categories(id),
          price NUMERIC(12, 2) NOT NULL,
          stock INTEGER NOT NULL
        )
        """,
        """
        INSERT INTO products (id, name, category_id, price, stock) VALUES
          (1, 'Laptop Pro 14', 1, 15000000.00, 10),
          (2, 'Wireless Mouse', 1, 250000.00, 50),
          (3, 'Kemeja Formal Pria', 2, 350000.00, 30),
          (4, 'Buku Pemrograman SQL', 3, 120000.00, 25)
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL
        )
        """,
        """
        INSERT INTO customers (id, name, email, city) VALUES
          (1, 'Alice Smith', 'alice@example.com', 'Jakarta'),
          (2, 'Bob Johnson', 'bob@example.com', 'Bandung'),
          (3, 'Charlie Brown', 'charlie@example.com', 'Surabaya'),
          (4, 'Diana Prince', 'diana@example.com', 'Jakarta')
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY,
          customer_id INTEGER NOT NULL REFERENCES customers(id),
          order_date DATE NOT NULL,
          total_amount NUMERIC(12, 2) NOT NULL,
          status VARCHAR(20) NOT NULL
        )
        """,
        """
        INSERT INTO orders (id, customer_id, order_date, total_amount, status) VALUES
          (1001, 1, '2026-01-10', 15250000.00, 'PAID'),
          (1002, 2, '2026-01-12', 350000.00, 'PAID'),
          (1003, 1, '2026-01-15', 120000.00, 'SHIPPED'),
          (1004, 3, '2026-01-18', 250000.00, 'PENDING')
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY,
          order_id INTEGER NOT NULL REFERENCES orders(id),
          product_id INTEGER NOT NULL REFERENCES products(id),
          quantity INTEGER NOT NULL,
          unit_price NUMERIC(12, 2) NOT NULL
        )
        """,
        """
        INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
          (1, 1001, 1, 1, 15000000.00),
          (2, 1001, 2, 1, 250000.00),
          (3, 1002, 3, 1, 350000.00),
          (4, 1003, 4, 1, 120000.00),
          (5, 1004, 2, 1, 250000.00)
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE OR REPLACE VIEW pelanggan AS 
        SELECT id, name AS nama, email, city AS kota FROM customers
        """,
        """
        CREATE OR REPLACE VIEW kategori AS 
        SELECT id, name AS nama_kategori, description AS deskripsi FROM categories
        """,
        """
        CREATE OR REPLACE VIEW produk AS 
        SELECT id, name AS nama_produk, category_id AS kategori_id, price AS harga, stock AS stok FROM products
        """,
        """
        CREATE OR REPLACE VIEW pesanan AS 
        SELECT id, customer_id AS pelanggan_id, order_date AS tanggal_pesan, total_amount AS total_bayar, status FROM orders
        """,
        # --- STUDI KASUS 3: PERPUSTAKAAN KAMPUS ---
        """
        CREATE TABLE IF NOT EXISTS members (
          id INTEGER PRIMARY KEY,
          member_no VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          faculty VARCHAR(100) NOT NULL,
          joined_year INTEGER NOT NULL
        )
        """,
        """
        INSERT INTO members (id, member_no, name, faculty, joined_year) VALUES
          (1, 'LIB-001', 'Farhan Hidayat', 'Ilmu Komputer', 2024),
          (2, 'LIB-002', 'Gita Gutawa', 'Ekonomi', 2023),
          (3, 'LIB-003', 'Hendra Wijaya', 'Ilmu Komputer', 2024),
          (4, 'LIB-004', 'Indah Permata', 'Kedokteran', 2022)
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY,
          isbn VARCHAR(50) UNIQUE NOT NULL,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          published_year INTEGER NOT NULL,
          total_copies INTEGER NOT NULL
        )
        """,
        """
        INSERT INTO books (id, isbn, title, author, published_year, total_copies) VALUES
          (1, '978-01', 'Desain Sistem Basis Data Relasional', 'Dr. Bambang', 2021, 5),
          (2, '978-02', 'Algoritma Pemrograman Lanjut', 'Prof. Suhartono', 2020, 3),
          (3, '978-03', 'Machine Learning untuk Pemula', 'Dr. Lisa Hartanto', 2022, 4),
          (4, '978-04', 'Struktur Data & Analisis Algoritma', 'Prof. Suhartono', 2019, 2)
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS borrowings (
          id INTEGER PRIMARY KEY,
          member_id INTEGER NOT NULL REFERENCES members(id),
          book_id INTEGER NOT NULL REFERENCES books(id),
          borrow_date DATE NOT NULL,
          due_date DATE NOT NULL,
          return_date DATE,
          status VARCHAR(20) NOT NULL
        )
        """,
        """
        INSERT INTO borrowings (id, member_id, book_id, borrow_date, due_date, return_date, status) VALUES
          (201, 1, 1, '2026-01-05', '2026-01-19', '2026-01-18', 'RETURNED'),
          (202, 1, 2, '2026-01-20', '2026-02-03', NULL, 'BORROWED'),
          (203, 2, 3, '2026-01-10', '2026-01-24', '2026-01-28', 'RETURNED'),
          (204, 3, 1, '2026-01-22', '2026-02-05', NULL, 'BORROWED')
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE TABLE IF NOT EXISTS fines (
          id INTEGER PRIMARY KEY,
          borrowing_id INTEGER NOT NULL REFERENCES borrowings(id),
          amount NUMERIC(10, 2) NOT NULL,
          status VARCHAR(20) NOT NULL,
          reason VARCHAR(255) NOT NULL
        )
        """,
        """
        INSERT INTO fines (id, borrowing_id, amount, status, reason) VALUES
          (1, 203, 20000.00, 'PAID', 'Keterlambatan pengembalian 4 hari')
        ON CONFLICT (id) DO NOTHING
        """,
        """
        CREATE OR REPLACE VIEW anggota_perpus AS 
        SELECT id, member_no AS nomor_anggota, name AS nama, faculty AS fakultas, joined_year AS tahun_bergabung FROM members
        """,
        """
        CREATE OR REPLACE VIEW buku AS 
        SELECT id, isbn, title AS judul, author AS pengarang, published_year AS tahun_terbit, total_copies AS jumlah_eksemplar FROM books
        """,
        """
        CREATE OR REPLACE VIEW peminjaman AS 
        SELECT id, member_id AS anggota_id, book_id AS buku_id, borrow_date AS tanggal_pinjam, due_date AS tenggat_kembali, return_date AS tanggal_kembali, status FROM borrowings
        """,
        """
        CREATE OR REPLACE VIEW denda AS 
        SELECT id, borrowing_id AS peminjaman_id, amount AS jumlah_denda, status, reason AS alasan FROM fines
        """,
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


if __name__ == "__main__":
    bootstrap()
