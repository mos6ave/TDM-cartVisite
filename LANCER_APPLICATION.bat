@echo off
title TDM - Lancement Application
color 0A
echo.
echo  ================================================
echo   TELEDIFFUSION DE MAURITANIE - TDM S.A
echo   Systeme de Gestion des Employes
echo  ================================================
echo.
echo  Demarrage en cours, veuillez patienter...
echo.

:: Verifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo  ERREUR: Python n'est pas installe !
    echo  Veuillez installer Python depuis: https://www.python.org
    pause
    exit /b
)

:: Verifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERREUR: Node.js n'est pas installe !
    echo  Veuillez installer Node.js depuis: https://nodejs.org
    pause
    exit /b
)

echo  [1/4] Installation des dependances Python...
cd /d "%~dp0backend"
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt -q

echo  [2/4] Preparation de la base de donnees...
python manage.py migrate -v 0

:: Seed seulement si DB vide
python -c "import os,django; os.environ['DJANGO_SETTINGS_MODULE']='config.settings'; django.setup(); from employees.models import Employee; exit(0 if Employee.objects.exists() else 1)" 2>nul
if errorlevel 1 (
    python seed_data.py
)

echo  [3/4] Demarrage du serveur backend...
start "TDM Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

echo  [4/4] Demarrage de l'interface frontend...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo  Installation des dependances frontend (premiere fois)...
    npm install
)

:: Attendre que le backend soit pret
timeout /t 3 /nobreak >nul

:: Ouvrir le navigateur automatiquement
start "" "http://localhost:5173"

start "TDM Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo  ================================================
echo   Application lancee avec succes !
echo   Ouvrez votre navigateur sur:
echo   http://localhost:5173
echo  ================================================
echo.
echo  Pour fermer l'application, fermez les fenetres
echo  "TDM Backend" et "TDM Frontend"
echo.
pause
