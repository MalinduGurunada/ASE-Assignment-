# Student 1 — Playwright: Page Object Model + E2E Release Lifecycle

## Your Role
You own the Playwright testing infrastructure and the end-to-end release lifecycle test.
Your feature demonstrates the **Page Object Model (POM)** design pattern and a complete
browser-driven workflow from login through all four release state transitions, CSV export,
and audit log verification.

## Your Files
```
frontend/playwright.config.ts
frontend/e2e/types/release.ts
frontend/e2e/config/test-data.ts
frontend/e2e/utils/api-client.ts
frontend/e2e/pages/auth.page.ts
frontend/e2e/pages/release-management.page.ts
frontend/e2e/specs/release-workflow.spec.ts
```

## Branch Workflow
1. Clone the repo (from the main branch initial push)
2. Create your branch: `git checkout -b feature/s1-playwright-lifecycle`
3. Delete the contents of each of your files listed above
4. Rebuild them incrementally following the 35-commit plan below
5. Push: `git push -u origin feature/s1-playwright-lifecycle`
6. Open a PR to main and merge

## Commit Plan (35 commits)

Use exactly the commit messages shown. Delete each file's content and add it back
one step at a time so your git log shows genuine incremental development.

### Commit 1 — `chore(e2e): install playwright and add base config`
**File:** `frontend/playwright.config.ts`
Add import and minimal export: `testDir: './e2e'`, `timeout: 30000`, `use: { baseURL: 'http://localhost:4200' }`.

### Commit 2 — `chore(e2e): add retries and reporter to playwright config`
Add `retries: 1` and `reporter: 'list'` to the config object.

### Commit 3 — `chore(e2e): configure webServer auto-start for Spring Boot backend`
Add first `webServer` entry: Spring Boot start command, port 8080, `reuseExistingServer: true`.

### Commit 4 — `chore(e2e): configure webServer auto-start for Angular frontend`
Add second `webServer` entry for Angular dev server on port 4200.

### Commit 5 — `chore(e2e): add Chromium browser project and global timeout`
Add `projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]` and `globalTimeout: 300000`.

### Commit 6 — `feat(e2e): define ReleaseStatus enum`
**File:** `frontend/e2e/types/release.ts`
Create file. Export enum: DRAFT, TESTING, APPROVED, RELEASED.

### Commit 7 — `feat(e2e): define Release interface`
Add `export interface Release` with fields: id, name, version, status.

### Commit 8 — `feat(e2e): add base URL and admin credentials to test-data config`
**File:** `frontend/e2e/config/test-data.ts`
Create file. Export `BASE_URL` and `ADMIN_USER` object.

### Commit 9 — `feat(e2e): add viewer credentials to test-data config`
Export `VIEWER_USER` object with username and password.

### Commit 10 — `feat(e2e): add uniqueSuffix helper to test-data config`
Export `export const uniqueSuffix = () => Date.now().toString(36)`.

### Commit 11 — `feat(e2e): scaffold api-client with imports and shared fetch helper`
**File:** `frontend/e2e/utils/api-client.ts`
Create file. Add imports from `@playwright/test`. Add private `apiFetch` helper.

### Commit 12 — `feat(e2e): implement registerUser in api-client`
Add `registerUser(username, password, role)` → POST `/api/auth/register`.

### Commit 13 — `feat(e2e): implement loginUser in api-client`
Add `loginUser(username, password)` → returns JWT token string.

### Commit 14 — `feat(e2e): implement loginAsAdmin convenience helper`
Add `loginAsAdmin()` using `ADMIN_USER` credentials.

### Commit 15 — `feat(e2e): implement ensureProduct helper`
Add `ensureProduct(token)` → POST `/api/products`, return product ID.

### Commit 16 — `feat(e2e): implement createRelease in api-client`
Add `createRelease(token, productId, name, version)` → return Release object.

### Commit 17 — `feat(e2e): implement getReleaseByName in api-client`
Add `getReleaseByName(token, name)` → GET `/api/releases`, find by name.

### Commit 18 — `feat(e2e): implement transitionRelease in api-client`
Add `transitionRelease(token, releaseId, targetStatus)` → POST `/api/releases/:id/transition`.

### Commit 19 — `feat(e2e): implement getAuditLogs in api-client`
Add `getAuditLogs(token)` → GET `/api/audit-logs`, return array.

### Commit 20 — `feat(e2e): implement exportAndVerifyCsv in api-client`
Add `exportAndVerifyCsv(token, releaseName)` → GET `/api/releases/export.csv`, return true if name present.

### Commit 21 — `feat(e2e): scaffold AuthPage with page field and constructor`
**File:** `frontend/e2e/pages/auth.page.ts`
Create file. Define `export class AuthPage` with `constructor(private page: Page)`.

### Commit 22 — `feat(e2e): add form locators to AuthPage`
Add `usernameInput`, `passwordInput`, `loginButton` as Locator fields.

### Commit 23 — `feat(e2e): add AuthPage.navigate() method`
Add `async navigate()` → `this.page.goto('/login')`.

### Commit 24 — `feat(e2e): implement AuthPage.login() composite method`
Add `async login(username, password)` → navigate, fill, click, wait for nav.

### Commit 25 — `feat(e2e): scaffold ReleaseManagementPage with constructor`
**File:** `frontend/e2e/pages/release-management.page.ts`
Create file. Define class with `constructor(private page: Page)`.

### Commit 26 — `feat(e2e): add navigateToReleaseManagement() method`
Click releases sidebar link and wait for heading.

### Commit 27 — `feat(e2e): add createRelease() UI method`
Click Create, fill name and version, submit.

### Commit 28 — `feat(e2e): add waitForState() polling helper`
Poll every 500ms until state badge matches or timeout (20000ms).

### Commit 29 — `feat(e2e): add transitionRelease() UI method`
Find release row, click action button, call `waitForState`.

### Commit 30 — `feat(e2e): scaffold release-workflow.spec.ts with describe block`
**File:** `frontend/e2e/specs/release-workflow.spec.ts`
Create file with imports and outer `describe('Admin release lifecycle', ...)` block.

### Commit 31 — `feat(e2e): add beforeAll setup to provision admin user and product`
Add `test.beforeAll` → register unique admin, login, create test product via api-client.

### Commit 32 — `test(e2e): add test — admin can login and reach release management`
Use AuthPage.login() and assert releases heading visible.

### Commit 33 — `test(e2e): add test — admin creates release in DRAFT state`
Call `releasePage.createRelease(...)`, assert DRAFT status badge visible.

### Commit 34 — `test(e2e): add tests for DRAFT→TESTING→APPROVED→RELEASED transitions`
Three sequential tests, one per transition, each asserting the new state badge.

### Commit 35 — `test(e2e): add audit log verification and CSV export assertions`
Call `getAuditLogs()` (assert 3+ entries) and `exportAndVerifyCsv()` (assert name present).

---

## Verification
```powershell
cd frontend
npx playwright test e2e/specs/release-workflow.spec.ts --headed
```

## Key VIVA Concepts
- **Page Object Model:** locators live in page classes — when the UI changes, update one class, not every test
- **auto-wait:** Playwright polls element state automatically; never use `sleep()`
- **`beforeAll` vs `beforeEach`:** shared DB provisioning runs once; per-test fixtures run each time
- **`waitForState()` polling:** async UI updates need polling with a timeout
- **`webServer` in config:** Playwright auto-starts both backend and frontend — tests are fully self-contained
