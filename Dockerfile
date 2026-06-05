# ── Stage 1 : Build React (image Node officielle, garantit la compatibilité Vite 8) ──
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ── Stage 2 : Django + fichiers React buildés ────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Copier uniquement le build React (pas node_modules, image finale légère)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/

# Installer les dépendances Python
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copier le backend Django
COPY backend/ ./backend/

# Collecter les fichiers statiques Django (admin, DRF…)
RUN cd backend && python manage.py collectstatic --noinput

EXPOSE 10000

CMD ["sh", "-c", "cd backend && python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120"]
