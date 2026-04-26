import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, authHeaders } from './config.js';

export function loginAsAdmin() {
  const res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }), { headers: { 'Content-Type': 'application/json' } });
}
