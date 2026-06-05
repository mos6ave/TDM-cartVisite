FROM python:3.11-slim

# Installer Node.js 18 (nécessaire pour builder le frontend React)
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Build React frontend ---
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# --- Install Python dependencies ---
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# --- Copy Django backend ---
COPY backend/ ./backend/

# Collecter les fichiers statiques Django (admin, DRF, etc.)
RUN cd backend && python manage.py collectstatic --noinput

EXPOSE 10000

# Migrations + démarrage gunicorn
CMD ["sh", "-c", "cd backend && python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120"]
