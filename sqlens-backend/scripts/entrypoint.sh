#!/bin/sh
set -e

echo "[SQLens Backend] Menunggu koneksi database PostgreSQL siap..."

# Wait for database port to be open using Python socket
python - << 'EOF'
import os
import socket
import sys
import time

host = os.environ.get("DATABASE_HOST", "db")
port = int(os.environ.get("DATABASE_PORT", "5432"))
timeout = 30
start = time.time()

while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"[SQLens Backend] Terhubung ke database di {host}:{port}!")
            sys.exit(0)
    except Exception:
        if time.time() - start > timeout:
            print(f"[SQLens Backend] Peringatan: Batas waktu menunggu database ({timeout}s) terlampaui.")
            sys.exit(1)
        time.sleep(1)
EOF

echo "[SQLens Backend] Menjalankan bootstrap database (schema & educational dataset)..."
python -m app.db.bootstrap || echo "[SQLens Backend] Bootstrap selesai dengan status non-zero (abaikan jika sudah terbuat)."

echo "[SQLens Backend] Memulai Uvicorn server..."
exec "$@"
