@echo off
cd /d "%~dp0"
echo ============================================================
echo  RMT Frontend ^| Angular ^| http://localhost:4200
echo  Start the backend first (start-backend.bat)
echo ============================================================
echo.

cd frontend
npm start
pause
