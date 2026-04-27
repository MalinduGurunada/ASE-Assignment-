# RMT Full Results Sheet (E2E + Performance)

Date: 2026-04-04
Environment: Local Windows machine
Backend: Spring Boot with e2e profile on http://localhost:8080
Frontend: Angular app on http://localhost:4200

## Executive Summary

1. Playwright E2E suite is passing end-to-end (5/5).
2. K6 performance suite is passing across all four scenarios with 0.00% request failure rate.
3. Target latency criteria were satisfied in full-profile runs.

## Scope Covered

1. JWT authentication and role-based access behavior.
2. Release lifecycle flow (DRAFT -> TESTING -> APPROVED -> RELEASED).
3. UI validation and negative navigation behavior.
4. API performance under load/stress/spike/write workloads.

## Playwright E2E Results

Command used:

```powershell
cd frontend
npm run e2e:headed
```

Observed result:

1. Total: 5 passed, 0 failed.
2. Runtime: ~29.4s.

Scenario status:

| Scenario | Spec | Status |
|---|---|---|
| Unauthenticated redirect to login | frontend/e2e/specs/negative-and-edge.spec.ts | Pass |
| Invalid navigation safety behavior | frontend/e2e/specs/negative-and-edge.spec.ts | Pass |
| Invalid release input validation | frontend/e2e/specs/negative-and-edge.spec.ts | Pass |
| Viewer restriction on privileged release actions | frontend/e2e/specs/rbac.spec.ts | Pass |
| Full admin workflow with transitions + CSV + audit check | frontend/e2e/specs/release-workflow.spec.ts | Pass |

## K6 Full-Profile Results

Tool binary used:

```text
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe
```

| Scenario | Script | Profile | Throughput (req/s) | Avg | P95 | Failure Rate | Checks |
|---|---|---|---:|---:|---:|---:|---:|
| Load | performance/k6/load-releases.js | 75 VUs for 2m | 3396.59 | 20.67 ms | 54.69 ms | 0.00% | 100% |
| Stress | performance/k6/stress-releases.js | Ramp to 150 VUs over 4m30s | 3080.92 | 19.99 ms | 73.23 ms | 0.00% | 100% |
| Spike | performance/k6/spike-releases.js | Spike to 250 VUs over 2m | 2902.33 | 43.44 ms | 158.35 ms | 0.00% | 100% |
| POST write load | performance/k6/post-releases.js | Ramp to 60 VUs over 2m30s | 2265.81 | 9.79 ms | 28.55 ms | 0.00% | 100% |

## Acceptance Criteria Check

| Requirement | Target | Outcome |
|---|---|---|
| Load test response time | p95 < 500 ms | Pass (54.69 ms) |
| Read endpoint stability under stress | no major failure burst | Pass (0.00% failed) |
| Spike resilience | stable service under sudden load | Pass (0.00% failed) |
| POST reliability under concurrent writes | low failure rate | Pass (0.00% failed) |
| UI workflow demonstrability | visually runnable headed suite | Pass (5/5) |

## Performance Interpretation

1. The system maintained 0.00% failure rate across all profiles, indicating strong backend stability and proper concurrency handling.
2. Spike testing showed increased latency (p95: 158.35 ms), which is expected under burst traffic and confirms graceful degradation rather than failure.
3. POST operations remained fast (avg: 9.79 ms), demonstrating efficient write handling and database performance.
4. Overall, the system shows high resilience under real-world load patterns.

## Advanced Testing Features

1. Auto-auth fallback in K6 scripts (self-healing test design).
2. Dual-mode execution:
Full-profile (evaluation).
Demo-profile (fast presentation).
3. Realistic workload simulation:
Concurrent reads and writes.
Sudden traffic spikes.
4. End-to-end UI validation with actual browser rendering.

## Testing Architecture

1. Playwright:
Validates frontend behavior and user workflows.
2. K6:
Targets backend APIs under load.
3. Combined approach:
Ensures both functional correctness and system scalability.

## Commands Used For Final Runs

```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=e2e"

cd ..\frontend
npm run e2e:headed

$env:K6_BASE_URL="http://localhost:8080"
$env:K6_ADMIN_PASSWORD="password"

C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/load-releases.js
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/stress-releases.js
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/spike-releases.js
C:\Users\Dell\Desktop\RMT\tools\k6\k6.exe run performance/k6/post-releases.js
```

## Viva Talking Points (Short)

1. E2E tests validate business correctness and user flow integrity.
2. K6 tests validate operational behavior under concurrency and burst traffic.
3. All core checks passed with zero failed requests in full-profile runs.
4. Spike profile produced the highest latency, which is expected and still within stable service behavior.

## Notes

1. K6 scripts include robust auth fallback (auto-register admin if seeded login is unavailable).
2. Full-profile and short demo-profile modes are both supported.
