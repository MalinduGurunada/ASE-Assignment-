@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "TOTAL=0"
set "PASSED=0"
set "FAILED=0"

echo ============================================================
echo  HESARA ^| K6 ^| Spike ^& Stress Testing
echo  Stress : 0 -^> 150 VUs ramp - finds saturation point
echo  Spike  : 10 -^> 250 VUs in 20s - tests burst resilience
echo ============================================================
echo.
echo  Requires backend running at http://localhost:8080
echo  Start with: cd backend ^& .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
echo.

call :RunStep "stress-releases.js" ".\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/stress-releases.js"
call :RunStep "spike-releases.js" ".\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/spike-releases.js"

call :PrintSummary
echo.
echo Press any key to close this window...
pause >nul

set "OVERALL_EXIT=0"
if !FAILED! GTR 0 set "OVERALL_EXIT=1"
endlocal & exit /b %OVERALL_EXIT%

:RunStep
set /a TOTAL+=1
set "STEP_NAME=%~1"
echo [!TOTAL!/2] Running !STEP_NAME!...
echo.
call cmd /c "%~2"
set "STEP_CODE=!ERRORLEVEL!"
set "STEP_NAME[!TOTAL!]=!STEP_NAME!"
set "STEP_CODE[!TOTAL!]=!STEP_CODE!"
if "!STEP_CODE!"=="0" (
  set /a PASSED+=1
) else (
  set /a FAILED+=1
)
echo.
exit /b 0

:PrintSummary
echo ============================================================
echo  TEST SUMMARY
echo ============================================================
for /L %%I in (1,1,!TOTAL!) do (
  set "NAME=!STEP_NAME[%%I]!"
  set "CODE=!STEP_CODE[%%I]!"
  if "!CODE!"=="0" (
    set "STATUS=PASS"
  ) else (
    set "STATUS=FAIL"
  )
  echo  %%I. !STATUS! - !NAME! ^(exit !CODE!^)
)
echo ------------------------------------------------------------
echo  Total: !TOTAL! ^| Passed: !PASSED! ^| Failed: !FAILED!
if !FAILED! GTR 0 (
  echo  Overall: FAIL
) else (
  echo  Overall: PASS
)
echo ============================================================
exit /b 0
