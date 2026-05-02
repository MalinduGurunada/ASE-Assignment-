// K6 shared configuration
export const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:8080';
export const ADMIN_USERNAME = __ENV.K6_ADMIN_USERNAME || 'k6admin';
export const ADMIN_PASSWORD = __ENV.K6_ADMIN_PASSWORD || 'k6pass123';

export function authHeaders(token) {
  return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
}

export const SHARED_THRESHOLDS = {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<500']
};
