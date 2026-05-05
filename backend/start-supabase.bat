@echo off
setlocal EnableExtensions EnableDelayedExpansion
set RMT_DB_URL=jdbc:postgresql://aws-0-[YOUR-REGION].pooler.supabase.com:6543/postgres?sslmode=require
set RMT_DB_USERNAME=postgres.qgyrlshqwshvylbhjtbh
set RMT_DB_PASSWORD=Diabalo@666
set RMT_JWT_SECRET=nFyMIEEQVi95V6qKrqQNUvkDqq54BYaGeTgIP/Sq+fY=

cd /d "%~dp0"
echo ============================================================
echo  BACKEND ^| Spring Boot ^| Supabase Profile
echo ============================================================
echo.
echo Starting backend with supabase profile...
echo.

call "%~dp0mvnw.cmd" spring-boot:run -Dspring-boot.run.profiles=supabase
set "EXIT_CODE=!ERRORLEVEL!"

echo.
echo ============================================================
echo  STARTUP SUMMARY
echo ============================================================
if "!EXIT_CODE!"=="0" (
  echo  Status: PASS ^(process exited cleanly^)
) else (
  echo  Status: FAIL ^(process exit code !EXIT_CODE!^)
)
echo  Exit code: !EXIT_CODE!
echo ============================================================
echo.
echo Press any key to close this window...
pause >nul
endlocal & exit /b %EXIT_CODE%
