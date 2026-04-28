# RMT Automated Testing System (Playwright + K6)

This guide provides a production-style QA setup for:

1. End-to-End UI testing with Playwright
2. Load and performance testing with K6

## 1) Playwright E2E Testing

### Added structure

- `frontend/playwright.config.ts`
- `frontend/e2e/config/test-data.ts`
- `frontend/e2e/pages/auth.page.ts`
- `frontend/e2e/pages/release-management.page.ts`
- `frontend/e2e/specs/release-workflow.spec.ts`
- `frontend/e2e/specs/rbac.spec.ts`
- `frontend/e2e/specs/negative-and-edge.spec.ts`
- `frontend/e2e/utils/api-client.ts`
- `frontend/e2e/types/release.ts`

### Install and setup

```powershell
cd frontend
npm install
npx playwright install chromium
```

### Environment variables (optional override)

```powershell
$env:PW_BASE_URL="http://localhost:4200"
$env:PW_API_BASE_URL="http://localhost:8080"
$env:PW_ADMIN_USERNAME="admin"
$env:PW_ADMIN_PASSWORD="password"
$env:PW_VIEWER_PASSWORD="Viewer#12345"
```

### Run tests

```powershell
cd frontend
npm run e2e
npm run e2e:headed
npm run e2e:debug
npm run e2e:report
```

Playwright auto-starts both services for local runs:

- Backend: `mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=e2e"`
- Frontend: `npm start -- --host localhost --port 4200`

So you do not need to manually boot backend/frontend for normal demo runs.

### What is covered

1. Full release lifecycle workflow:
- Admin login
- Create release
- DRAFT -> TESTING -> APPROVED -> RELEASED
- UI status checks at each transition
- CSV export verification
- Audit log verification via API

2. Role-based access control:
- Login as VIEWER user
- Attempt restricted transition action
- Verify restricted operation is blocked (UI/backend)

3. Negative and edge scenarios:
- Empty release name validation
- Oversized release name validation (> 200 chars)
- Unauthorized route access redirects to login
- Invalid navigation safety behavior

## 2) K6 Performance Testing

### Added structure

- `performance/k6/common/config.js`
- `performance/k6/common/auth.js`
- `performance/k6/load-releases.js`
- `performance/k6/stress-releases.js`
- `performance/k6/spike-releases.js`
- `performance/k6/post-releases.js`

### K6 install

Option A (winget):

```powershell
winget install k6.k6
```

Option B (Chocolatey):

```powershell
choco install k6
```

### Environment variables

```powershell
$env:K6_BASE_URL="http://localhost:8080"
$env:K6_ADMIN_USERNAME="admin"
$env:K6_ADMIN_PASSWORD="password"
$env:K6_LOAD_VUS="75"
$env:K6_LOAD_DURATION="2m"
```

### Run K6 scripts

```powershell
k6 run performance/k6/load-releases.js
k6 run performance/k6/stress-releases.js
k6 run performance/k6/spike-releases.js
k6 run performance/k6/post-releases.js
```

### What each script validates

1. `load-releases.js`:
- 50-100 simulated users (default 75)
- Repeated GET `/api/releases`
- Threshold target p95 < 500 ms

2. `stress-releases.js`:
- Gradual ramp up to high load
- Reveals saturation and degradation point

3. `spike-releases.js`:
- Sudden jump to heavy traffic
- Observes resiliency and recovery behavior

4. `post-releases.js`:
- Create releases under concurrent write load
- Tracks success/failure rates for write operations

### Metrics and checks included

- Response time (`http_req_duration`)
- Failure rate (`http_req_failed`)
- Throughput (requests/second from summary)
- Response validation via `check(...)`
- Threshold assertions for pass/fail criteria

## 3) Live Demo Plan (2 minutes/student)

### Demo flow: Playwright

1. Start backend and frontend.
2. Run headed E2E:

```powershell
cd frontend
npm run e2e:headed -- e2e/specs/release-workflow.spec.ts
```

3. Show on screen:
- Auto-login
- Release creation
- State transitions in table
- CSV export download
- Green assertion output in terminal

### Demo flow: K6

1. Run quick load test:

```powershell
k6 run performance/k6/load-releases.js
```

2. Show on screen:
- VUs and iterations
- p95 latency
- failure rate
- checks passed summary

### Expected outputs

- Playwright: all tests pass with visible browser interactions
- K6: summary report with thresholds and timing metrics

## 4) Viva Preparation Answers

### Why Playwright over Selenium?

Playwright provides built-in auto-waiting, modern browser context isolation, stable selectors, powerful tracing/video/screenshots, and faster setup for CI and live demos. It reduces flaky test behavior compared to legacy WebDriver-heavy setups.

### Difference between E2E and Load testing?

E2E testing validates business workflows and correctness from user perspective (UI + backend integration). Load testing validates system performance and stability under concurrent traffic.

### What is a VU in K6?

A VU (Virtual User) is an independent execution context simulating one concurrent user running the test script logic.

### Why test edge cases?

Edge cases reveal defects in validation, authorization boundaries, and error handling that normal happy-path tests miss. They are common root causes of production incidents.

### What happens under high load?

Under high load, response times rise, queueing increases, and error rates can climb when resources saturate. Stress/spike tests identify these limits and recovery characteristics before production incidents.

## Professional Notes

- Tests use a Page Object Model for maintainability.
- E2E data uses unique suffixes to avoid collisions.
- API setup helpers reduce UI flakiness and speed up execution.
- K6 scripts include thresholds so test runs can be used as quality gates.
