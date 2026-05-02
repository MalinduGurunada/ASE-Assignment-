@echo off
cd /d "%~dp0"
echo ============================================================
echo  RMT Backend ^| Spring Boot ^| http://localhost:8080
echo  Profile: H2 in-memory database (no MySQL required)
echo ============================================================
echo.

cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
pause
