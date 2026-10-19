FROM python:3.11-slim

# Mencegah penulisan bytecode .pyc dan buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install utility curl untuk healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code backend
COPY . .

# Berikan hak akses eksekusi pada script entrypoint
RUN chmod +x /app/scripts/entrypoint.sh

# Expose port uvicorn
EXPOSE 8000

# Entrypoint dan default command
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
