@echo off
cd /d "%~dp0"
echo ============================================================
echo  MALINDU ^| K6 ^| Data-Driven ^& Write-Load Testing
echo  Load         : constant 20 VUs, 3m baseline read load
echo  Post-releases: concurrent write throughput stress
echo  Data-driven  : SharedArray 10 templates, post + read-back
echo ============================================================
echo.
echo  Requires backend running at http://localhost:8080
echo  Start with: cd backend ^& .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
echo.

echo [1/3] Load test (load-releases.js) ...
echo       20 VUs for 3 minutes — baseline GET load
echo.
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/load-releases.js

echo.
echo [2/3] Post-releases write test (post-releases.js) ...
echo       Concurrent write throughput across multiple VUs
echo.
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/post-releases.js

echo.
echo [3/3] Data-driven releases test (data-driven-releases.js) ...
echo       10 versioned templates, each VU posts then reads back
echo.
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/data-driven-releases.js

echo.
echo ============================================================
echo  Done. All thresholds listed above (PASS = checkmark).
echo ============================================================
pause
