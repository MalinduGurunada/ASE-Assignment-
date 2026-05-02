@echo off
cd /d "%~dp0"
echo ============================================================
echo  SHAZAAN ^| Playwright ^| E2E Release Lifecycle
echo  Tests: login, release creation, state transitions
echo         DRAFT -^> TESTING -^> APPROVED -^> RELEASED,
echo         CSV export, audit log verification
echo ============================================================
echo.

cd frontend
echo [1/1] Running release-workflow.spec.ts (headed browser)...
echo.
npx playwright test e2e/specs/release-workflow.spec.ts --headed

echo.
echo ============================================================
echo  Done. Check the Playwright HTML report with:
echo    npx playwright show-report
echo ============================================================
pause
