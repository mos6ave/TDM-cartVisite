@echo off
chcp 65001 >nul
echo =============================================
echo   TDM - Carte de Visite  (Demarrage rapide)
echo =============================================
cd /d "%~dp0"

echo.
echo Demarrage du serveur...
echo.
echo   http://localhost:8000
echo   http://[IP_DE_CE_PC]:8000  (depuis d'autres machines)
echo.
echo   CTRL+C pour arreter.
echo.
waitress-serve --host=0.0.0.0 --port=8000 config.wsgi:application
