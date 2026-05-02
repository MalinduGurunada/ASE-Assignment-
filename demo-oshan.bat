@echo off
cd /d "%~dp0"
echo ============================================================
echo  OSHAN ^| Playwright ^| RBAC + Negative ^& Edge Cases
echo  Tests: viewer 403 enforcement, empty-name validation,
echo         oversized input (^>200 chars), unauthenticated
echo         redirect to login
echo ============================================================
echo.

cd frontend
echo [1/2] Running rbac.spec.ts (headed browser)...
echo.
npx playwright test e2e/specs/rbac.spec.ts --headed

echo.
echo [2/2] Running negative-and-edge.spec.ts (headed browser)...
echo.
npx playwright test e2e/specs/negative-and-edge.spec.ts --headed

echo.
echo ============================================================
echo  Done. Check the Playwright HTML report with:
echo    npx playwright show-report
echo ============================================================
pause
