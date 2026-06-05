@echo off
chcp 65001 >nul
echo =============================================
echo   DEPLOIEMENT - TDM Carte de Visite
echo =============================================
cd /d "%~dp0"

echo.
echo [1/5] Installation des dependances Python...
pip install -r requirements.txt
if errorlevel 1 ( echo ERREUR: pip install a echoue & pause & exit /b 1 )

echo.
echo [2/5] Construction du frontend React...
cd ..\frontend
call npm install
if errorlevel 1 ( echo ERREUR: npm install a echoue & pause & exit /b 1 )
call npm run build
if errorlevel 1 ( echo ERREUR: npm build a echoue & pause & exit /b 1 )
cd ..\backend

echo.
echo [3/5] Collecte des fichiers statiques Django (admin)...
python manage.py collectstatic --noinput

echo.
echo [4/5] Application des migrations base de donnees...
python manage.py migrate

echo.
echo [5/5] Demarrage du serveur sur le port 8000...
echo.
echo =============================================
echo   Application disponible sur:
echo     http://localhost:8000
echo     http://[IP_DE_CE_PC]:8000  (autres machines)
echo.
echo   Pour connaitre l'IP de ce PC, tapez:
echo     ipconfig
echo.
echo   CTRL+C pour arreter le serveur.
echo =============================================
echo.
waitress-serve --host=0.0.0.0 --port=8000 config.wsgi:application
