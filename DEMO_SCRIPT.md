# RMT Demo Script — SE3112 Presentation

Date: 2026-04-25
Module: SE3112 Advanced Software Engineering
Duration: 12 minutes total

---

## Timing Overview

| Slot | Content | Who | Time |
|------|---------|-----|------|
| Group Intro | Codebase, tools, rationale | All (led by Student 1) | 2 min |
| Demo A | Playwright — Release Lifecycle + POM | Student 1 | 2 min |
| Demo B | Playwright — RBAC + Edge Cases | Student 2 | 2 min |
| Demo C | K6 — Spike & Stress Testing | Student 3 | 2 min |
| Demo D | K6 — Data-Driven Payload Testing | Student 4 | 2 min |
| VIVA / Q&A | Individual questions from panel | All | 2 min |

---

## Pre-Demo Setup (Do Before Screen Share)

Run these once to confirm everything is ready:

```powershell
# 1. Verify backend compiles and tests pass
cd C:\Users\Dell\Desktop\RMT\backend
.\mvnw.cmd test

# 2. Install frontend dependencies
cd C:\Users\Dell\Desktop\RMT\frontend
npm install
npx playwright install chromium

# 3. Set K6 environment variables (keep this terminal open)
$env:K6_BASE_URL     = "http://localhost:8080"
$env:K6_ADMIN_PASSWORD = "password"
```

Keep these files open in tabs before starting:
- `frontend/e2e/specs/release-workflow.spec.ts`
- `frontend/e2e/specs/rbac.spec.ts`
- `frontend/e2e/specs/negative-and-edge.spec.ts`
- `performance/k6/stress-releases.js`
- `performance/k6/spike-releases.js`
- `performance/k6/data-driven-releases.js`
- `K6_RESULTS_SHEET.md`

---

## Group Intro — 2 Minutes (Student 1 leads, all present)

**Speak:**

"Our codebase is a Release Management Tool — a full-stack platform built with Spring Boot and Angular that manages the full release lifecycle: DRAFT, TESTING, APPROVED, RELEASED. It has JWT authentication, role-based access control, audit logging, and a CSV export.

We chose two testing categories:
- Playwright for E2E / UI Testing — because the app has real user workflows and state-dependent UI behavior that unit tests cannot catch.
- K6 for Load / Performance Testing — because the API is stateful and must hold up under concurrent traffic in a production context.

No Selenium, no Postman — Playwright gives us native async handling and built-in trace/video tooling, and K6 is a developer-first load tool with scriptable scenarios in JavaScript."

---

## Demo A — Student 1: Playwright Page Object Model + Release Lifecycle (2 min)

**Speak:**

"I own the end-to-end release lifecycle test. This is a full browser test — no mocks, no stubs — running against the real application stack. I implemented it using the Page Object Model pattern to separate test logic from DOM interaction."

**Show the code (30 sec):**

Point at `frontend/e2e/specs/release-workflow.spec.ts`:
- The `setup()` block registers a unique admin user via API before the browser opens — no hardcoded test data.
- The test walks through login, release creation, and each state transition in sequence.
- At the end it calls the CSV export endpoint and the audit log API to verify server-side evidence of every action.

Point at `frontend/e2e/pages/release-management.page.ts`:
- Show one method (e.g. `transitionRelease`) — the test spec calls a named method, not raw `page.click(selector)`.

**Run it (60 sec):**

```powershell
cd C:\Users\Dell\Desktop\RMT\frontend
npx playwright test e2e/specs/release-workflow.spec.ts --headed
```

Point on screen while it runs:
1. Browser opens and performs real user actions.
2. The state badge on the release card updates at each transition.
3. Terminal shows all assertions passing.

**Close:**

"This confirms the complete release workflow is correct end-to-end — from the browser click to the database state."

---

## Demo B — Student 2: Playwright RBAC Enforcement + Negative & Edge Case Testing (2 min)

**Speak:**

"I own two complementary test files. The RBAC test proves that role boundaries are enforced at both the UI and the API level. The negative/edge case test proves that input validation works and that the system fails safely."

**Show the code (30 sec):**

Point at `frontend/e2e/specs/rbac.spec.ts`:
- A viewer-role user is registered dynamically.
- The test attempts to call a state-transition endpoint directly and asserts a 403 response.
- It also verifies that UI controls are absent or disabled for viewer users.

Point at `frontend/e2e/specs/negative-and-edge.spec.ts`:
- Show the oversized-name test: a 201-character name is submitted and the test asserts the `ng-invalid` class appears and the error message is visible.
- Show the unauthenticated redirect test: navigating to a protected route without a token redirects to `/login`.

**Run it (60 sec):**

```powershell
cd C:\Users\Dell\Desktop\RMT\frontend
npx playwright test e2e/specs/rbac.spec.ts e2e/specs/negative-and-edge.spec.ts --headed
```

Point on screen:
1. The 403 response printed in the terminal confirms API-level enforcement.
2. The browser shows the error message appearing on the oversized-name input.

**Close:**

"Security tests pass at both layers — the backend rejects the request before the UI even has a chance to display a result."

---

## Demo C — Student 3: K6 Spike & Stress Testing Configurations (2 min)

**Speak:**

"I own the spike and stress profiles. These two scripts answer different questions: stress testing finds the saturation point by ramping VUs gradually. Spike testing asks whether the system survives and recovers from a sudden traffic burst."

**Show the code (30 sec):**

Point at `performance/k6/stress-releases.js`:
- Show the `stages` array: 0 → 25 → 50 → 100 → 150 VUs over 4.5 minutes.
- Explain that the shape is deliberate — each plateau lets us see where latency inflects.

Point at `performance/k6/spike-releases.js`:
- Show the spike shape: 10 → 250 VUs in 20 seconds, held for 40 seconds, then dropped.
- Explain this simulates a flash-sale or viral-traffic event.

**Show recorded results (30 sec):**

Open `K6_RESULTS_SHEET.md` and highlight:
- Stress p95: 73.23 ms at 150 VUs — still well inside the 500 ms threshold.
- Spike p95: 158.35 ms at 250 VUs — latency rose but failure rate stayed at 0.00%.

**Run spike live (30 sec — it completes fast):**

```powershell
cd C:\Users\Dell\Desktop\RMT
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/spike-releases.js
```

**Close:**

"Zero failures under 250 concurrent users in a sudden burst. The system degrades gracefully in latency without dropping requests."

---

## Demo D — Student 4: K6 Data-Driven Payload Testing (2 min)

**Speak:**

"I own the data-driven load test. Unlike the other K6 scripts that generate random suffixes, this test drives real payload variation using K6's SharedArray — a built-in primitive that allocates one dataset in memory and shares it read-only across all VUs."

**Show the code (45 sec):**

Point at `performance/k6/data-driven-releases.js`:

- `SharedArray('releasePayloads', ...)` — 10 structured templates with distinct versions, names, and environment tags. Explain that `SharedArray` avoids duplicating this data once per VU.
- The selection logic: `releasePayloads[(__VU + __ITER) % releasePayloads.length]` — each VU+iteration gets a different template, cycling evenly through the dataset.
- POST then GET: the script creates a release from the template, then immediately reads it back by ID and asserts the version prefix matches what was sent.
- The `checks: ['rate>0.95']` threshold — this fails the test if more than 5% of assertions are wrong, catching data integrity issues, not just HTTP failures.

**Run it (45 sec):**

```powershell
cd C:\Users\Dell\Desktop\RMT
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/data-driven-releases.js
```

Point on screen:
1. The `checks` line in the summary — confirm rate > 95%.
2. The `http_req_duration` p95 — confirm it stays under 600 ms.

**Close:**

"This proves the API handles diverse, realistic payloads correctly under concurrent load — not just identical requests from random strings."

---

## VIVA / Q&A — 2 Minutes

Anticipated per-student questions:

**Student 1 — Playwright POM + Lifecycle**
- Q: Why Page Object Model instead of inline selectors?
  A: POM decouples test logic from DOM structure. When the UI changes, we update one page class, not every test that references that element.
- Q: Why do you register a new user in `setup()` instead of using a fixed test account?
  A: A unique suffix per run prevents state bleed between test runs and makes the test self-contained.

**Student 2 — RBAC + Edge Cases**
- Q: Why test the API directly in an E2E test?
  A: The UI could hide a button, but if the API isn't protected, a determined user with curl can still exploit it. We test both layers.
- Q: What is `ng-invalid`?
  A: Angular's reactive forms add this CSS class to a control when its validators fail. We assert on the class to confirm validation fired without coupling to the specific error message text.

**Student 3 — Spike & Stress**
- Q: What is the difference between stress and spike testing?
  A: Stress ramps gradually to find the breaking point. Spike jumps instantly to simulate burst traffic and tests recovery — the system must still be usable after the spike drops off.
- Q: What is a VU in K6?
  A: A Virtual User is one concurrent execution context simulating a single active user. 250 VUs means 250 simultaneous in-flight requests.

**Student 4 — Data-Driven Testing**
- Q: Why SharedArray instead of a regular JS array?
  A: A regular array would be copied into every VU's memory space. SharedArray is allocated once and mapped read-only — critical for large datasets at high VU counts.
- Q: Why assert on `checks` rate, not just `http_req_failed`?
  A: `http_req_failed` only catches transport errors (network, 5xx). `checks` catches application-level correctness — the server returned 200 with the wrong data. Both are needed.

---

## Fast Re-Run Commands (If Panel Asks)

```powershell
# Playwright — all E2E tests
cd C:\Users\Dell\Desktop\RMT\frontend
npx playwright test --headed

# K6 — spike (fastest to finish, ~2 min)
cd C:\Users\Dell\Desktop\RMT
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/spike-releases.js

# K6 — data-driven (~2 min)
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/data-driven-releases.js
```
