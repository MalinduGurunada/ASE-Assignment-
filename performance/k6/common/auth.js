import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, authHeaders } from './config.js';

export function loginAsAdmin() {
  let res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }), { headers: { 'Content-Type': 'application/json' } });
  if (res.status === 401) {
    http.post(`${BASE_URL}/api/auth/register`, JSON.stringify({ username: ADMIN_USERNAME, email: `${ADMIN_USERNAME}@rmt.local`, password: ADMIN_PASSWORD, role: 'ADMIN' }), { headers: { 'Content-Type': 'application/json' } });
    res = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }), { headers: { 'Content-Type': 'application/json' } });
  }
  let token;
  try {
    token = res.json('accessToken');
  } catch (e) {
    console.error(`loginAsAdmin: failed to parse token — status ${res.status}, body: ${res.body}`);
    throw e;
  }
  if (!token) throw new Error('loginAsAdmin: token is null');
  return token;
}

export function ensureProduct(token, payload) {
  const res = http.post(`${BASE_URL}/api/products`, JSON.stringify(payload), authHeaders(token));
  return res.json('id');
}
