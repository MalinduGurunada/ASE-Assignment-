@echo off
cd /d "%~dp0"
echo ============================================================
echo  HESARA ^| K6 ^| Spike ^& Stress Testing
echo  Stress : 0 -^> 150 VUs ramp — finds saturation point
echo  Spike  : 10 -^> 250 VUs in 20s — tests burst resilience
echo ============================================================
echo.
echo  Requires backend running at http://localhost:8080
echo  Start with: cd backend ^& .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
echo.

echo [1/2] Stress test (stress-releases.js) ...
echo       Stages: 0^>50 VUs (1m) ^| hold 150 VUs (3m) ^| ramp down (1m)
echo.
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/stress-releases.js

echo.
echo [2/2] Spike test (spike-releases.js) ...
echo       Stages: baseline 10 VUs ^| spike to 250 VUs (20s) ^| recover
echo.
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/spike-releases.js

echo.
echo ============================================================
echo  Done. All thresholds listed above (PASS = checkmark).
echo ============================================================
pause
