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

export {};
