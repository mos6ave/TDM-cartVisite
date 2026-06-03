# TDM — Gestion des Employés + Cartes de Visite

## Prérequis
- Python 3.10+
- Node.js 18+

## Installation & Démarrage

### 1. Backend Django
```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Créer la base de données
python manage.py migrate

# Insérer les données de démonstration
python seed_data.py

# Lancer le serveur
python manage.py runserver
```
→ API disponible sur http://localhost:8000/api

### 2. Frontend React
```bash
cd frontend
npm install
npm run dev
```
→ Interface disponible sur http://localhost:5173

## API Endpoints
| URL | Description |
|-----|-------------|
| GET/POST /api/employees/ | Liste / Créer |
| GET/PATCH/DELETE /api/employees/{id}/ | Détail / Modifier / Supprimer |
| GET /api/employees/{id}/business-card/ | Générer carte PDF |
| GET/POST /api/departments/ | Départements |

## Carte de visite
- Taille : 90mm × 60mm
- 2 pages : Recto (Français) + Verso (Arabe)
- Design identique à la vraie carte TDM
- Logo TDM réel intégré
