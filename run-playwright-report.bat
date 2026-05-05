@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "TOTAL=0"
set "PASSED=0"
set "FAILED=0"

echo ============================================================
echo  PLAYWRIGHT ^| Full Run + HTML Report
echo ============================================================
echo.

if not exist "frontend\package.json" (
  echo ERROR: frontend\package.json not found.
  echo Run this script from the project root.
  echo.
  echo Press any key to close this window...
  pause >nul
  endlocal & exit /b 1
)

cd frontend
call :RunStep "Run Playwright tests with HTML reporter" "npx playwright test --reporter=html --workers=1"

echo [2/2] Opening HTML report...
echo.
if exist "playwright-report\index.html" (
  start "" "playwright-report\index.html"
  set /a TOTAL+=1
  set "STEP_NAME[!TOTAL!]=Open playwright-report\index.html"
  set "STEP_CODE[!TOTAL!]=0"
  set /a PASSED+=1
) else (
  set /a TOTAL+=1
  set "STEP_NAME[!TOTAL!]=Open playwright-report\index.html"
  set "STEP_CODE[!TOTAL!]=1"
  set /a FAILED+=1
  echo Report not found at frontend\playwright-report\index.html
  echo.
)
cd ..

call :PrintSummary
echo.
echo Tip: To serve report with Playwright, run:
echo   cd frontend ^& npx playwright show-report
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
