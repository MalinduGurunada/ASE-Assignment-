import { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/test-data';

async function apiFetch(request: APIRequestContext, path: string, options: any = {}) {
  const url = `${BASE_URL}${path}`;
  return request.fetch(url, options);
}

export async function registerUser(request: APIRequestContext, username: string, password: string, role: 'ADMIN' | 'VIEWER') {
  const res = await apiFetch(request, `/api/auth/register`, {
    method: 'POST',
    data: { username, email: `${username}@e2e.local`, password, role }
  });
  if (!res.ok()) throw new Error(`register failed: ${res.status()}`);
  return res;
}

export async function loginUser(request: APIRequestContext, username: string, password: string): Promise<string> {
  const res = await apiFetch(request, `/api/auth/login`, {
    method: 'POST',
    data: { username, password }
  });
  if (!res.ok()) throw new Error(`login failed: ${res.status()}`);
  const body = await res.json();
  return body.accessToken ?? body.token ?? '';
}

export {};