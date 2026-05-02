# Release Management Tool (RMT)

A full-stack release orchestration platform to manage products, releases, changelogs, deployments, and audit trails across environments.

## What This Project Includes

- Spring Boot 3 backend (Java 17) with JWT authentication and role-based authorization.
- Angular 17 frontend with feature modules for auth, dashboard, product/release, and deployment workflows.
- Flyway-managed schema migrations.
- Release state-machine transitions: `DRAFT -> TESTING -> APPROVED -> RELEASED`.
- CSV export for release reporting.
- AOP-based audit logging for state-changing operations.

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.2.4
- Spring Security (JWT + method security)
- Spring Data JPA
- Flyway
- MySQL (runtime) / H2 (tests)
- JUnit 5 + Mockito + MockMvc

### Frontend

- Angular 17
- RxJS
- Angular Material
- Chart.js
- Karma + Jasmine

## Repository Structure

```text
RMT/
  backend/
    src/main/java/com/rmt/
      audit/
      config/
      domain/
      repository/
      security/
      service/
      web/
      RmtApplication.java
    src/main/resources/
      application.properties
      db/migration/
        V1__init_schema.sql
        V2__seed_admin_user.sql
    src/test/
      java/com/rmt/
      resources/application.properties
    pom.xml
    .env.example
  frontend/
    src/app/
      core/
        guards/
        interceptors/
        services/
        models.ts
      features/
        auth/
        dashboard/
        product/
        deployment/
      app.config.ts
      app.routes.ts
```

## Prerequisites

- Java 17+
- Node.js 18+ and npm
- MySQL 8+ (or compatible)
- (Optional) Maven installed globally. Wrapper (`mvnw`) is included.

## Environment Configuration

Backend runtime uses environment variables. `RMT_DB_PASSWORD` and `RMT_JWT_SECRET` are required.

Use `backend/.env.example` as a template:

```env
RMT_DB_URL=jdbc:mysql://localhost:3306/rmt?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
RMT_DB_USERNAME=rmt
RMT_DB_PASSWORD=change_me
RMT_JWT_SECRET=replace_with_base64_secret_at_least_256_bits
```

If you use PostgreSQL locally, set `RMT_DB_URL` to a PostgreSQL JDBC URL (for example `jdbc:postgresql://localhost:5432/rmt`).

### Windows PowerShell example

```powershell
$env:RMT_DB_URL="jdbc:mysql://localhost:3306/rmt?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:RMT_DB_USERNAME="rmt"
$env:RMT_DB_PASSWORD="change_me"
$env:RMT_JWT_SECRET="<base64-secret>"
```

## Run the Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Default local backend URL:

- `http://localhost:8080`

Flyway migrations run automatically on startup.

## Run the Frontend

```powershell
cd frontend
npm install
npm start
```

Default frontend URL:

- `http://localhost:4200`

## Test Commands

### Backend tests

```powershell
cd backend
.\mvnw.cmd test
```

### Frontend tests (headless)

```powershell
cd frontend
npx ng test --watch=false --browsers=ChromeHeadless
```

### Frontend production build

```powershell
cd frontend
npm run build
```

## Authentication and Roles

JWT-based auth is implemented.

- Public endpoints: `/api/auth/**`
- Role `ADMIN`: full write operations
- Role `VIEWER`: read-only operations on protected resources

## Core API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` (ADMIN)
- `PUT /api/products/{id}` (ADMIN)
- `DELETE /api/products/{id}` (ADMIN)

### Releases

- `GET /api/releases`
- `GET /api/releases/{id}`
- `POST /api/releases` (ADMIN)
- `PUT /api/releases/{id}` (ADMIN)
- `DELETE /api/releases/{id}` (ADMIN)
- `POST /api/releases/{id}/transition` (ADMIN)
- `GET /api/releases/export.csv`

### Deployments

- `GET /api/deployments`
- `POST /api/deployments` (ADMIN)
- `PUT /api/deployments/{id}` (ADMIN)
- `DELETE /api/deployments/{id}` (ADMIN)

### Changelog

- `GET /api/changelog?releaseId={id}`
- `POST /api/changelog` (ADMIN)
- `DELETE /api/changelog/{id}` (ADMIN)

### Audit Logs

- `GET /api/audit-logs`

## Example API Flow

1. Register or login to receive JWT.
2. Include `Authorization: Bearer <token>` for protected endpoints.
3. Create a product.
4. Create a release under the product.
5. Move release through state transitions.
6. Create deployments and changelog entries.
7. Export CSV report from `/api/releases/export.csv`.
8. Inspect latest audit records via `/api/audit-logs`.

## Frontend Security Integration

Frontend includes:

- HTTP interceptor that appends JWT to non-auth API requests.
- Route guard redirecting unauthenticated users to login.

## Database Migrations

- `V1__init_schema.sql`: creates all core tables.
- `V2__seed_admin_user.sql`: inserts default admin if missing.

## Troubleshooting

### 401/403 responses

- Ensure JWT exists in browser storage.
- Ensure token belongs to role needed by endpoint.

### Flyway migration issues

- Verify DB user has schema creation and DDL privileges.
- Check migration table and ordering in `db/migration`.

### Frontend cannot reach backend

- Confirm backend is running at `http://localhost:8080`.
- If deployed elsewhere, update `frontend/src/app/core/api.config.ts`.

## Security Notes

- Do not commit real secrets in source control.
- Use environment variables or secret managers in all environments.
- Rotate JWT and DB credentials periodically.

## Current Status

The project is implemented as a complete, testable MVP with backend and frontend integration, role-based security, migrations, and reporting export.

## Team Contributions

This project is assessed under SE3112 (Advanced Software Engineering). The two testing categories selected are **E2E / UI Testing (Playwright)** and **Load / Performance Testing (K6)**. Each student owns one distinct feature.

| Student | Tool | Feature | Key Files |
|---------|------|---------|-----------|
| Shazaan | Playwright | **Page Object Model + End-to-End Release Lifecycle** — full browser test covering login, release creation, DRAFT → TESTING → APPROVED → RELEASED transitions, CSV export, and audit log verification via API | `frontend/e2e/specs/release-workflow.spec.ts`<br>`frontend/e2e/pages/auth.page.ts`<br>`frontend/e2e/pages/release-management.page.ts` |
| Oshan | Playwright | **RBAC Enforcement + Negative & Edge Case Testing** — verifies that viewer roles are blocked from privileged actions (403), and validates UI rejection of empty names, oversized input (>200 chars), and unauthenticated redirects | `frontend/e2e/specs/rbac.spec.ts`<br>`frontend/e2e/specs/negative-and-edge.spec.ts` |
| Hesara | K6 | **Spike & Stress Testing Configurations** — ramp-based stress profile (0 → 150 VUs) identifies the saturation point; spike profile (10 → 250 VUs in 20 s) tests burst resilience and recovery | `performance/k6/stress-releases.js`<br>`performance/k6/spike-releases.js` |
| Malindu | K6 | **Data-Driven & Write-Load Testing** — uses K6 `SharedArray` to feed 10 distinct release templates (versioned, environment-tagged) to concurrent VUs; each iteration picks a unique template, posts it, then reads it back to verify server-side persistence; `post-releases.js` stress-tests concurrent write throughput | `performance/k6/data-driven-releases.js`<br>`performance/k6/load-releases.js`<br>`performance/k6/post-releases.js` |

### Run Commands per Feature

**Shazaan — Playwright Release Lifecycle (headed)**
```powershell
cd frontend
npx playwright test e2e/specs/release-workflow.spec.ts --headed
```

**Oshan— Playwright RBAC + Edge Cases (headed)**
```powershell
cd frontend
npx playwright test e2e/specs/rbac.spec.ts e2e/specs/negative-and-edge.spec.ts --headed
```

**Hesara — K6 Spike & Stress**
```powershell
# Stress
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/stress-releases.js
# Spike
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/spike-releases.js
```

**Malindu — K6 Data-Driven & Write-Load Testing**
```powershell
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/data-driven-releases.js
.\performance\k6-bin\k6-v1.7.1-windows-amd64\k6.exe run performance/k6/post-releases.js
```

## QA Automation Suite

Comprehensive Playwright E2E and K6 performance testing assets are available in `QA_TESTING_GUIDE.md`.
