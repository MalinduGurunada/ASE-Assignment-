import { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/test-data';

async function apiFetch(request: APIRequestContext, path: string, options: any = {}) {
  const url = $BASE_URL;
  return request.fetch(url, options);
}

export async function registerUser(request: APIRequestContext, username: string, password: string, role: 'ADMIN' | 'VIEWER') {
  const res = await apiFetch(request, /api/auth/register, { method: 'POST', data: { username, email: $username@e2e.local, password, role } });
  if (!res.ok()) throw new Error(egister failed: .status());
  return res;
}

export async function loginUser(request: APIRequestContext, username: string, password: string): Promise<string> {
  const res = await apiFetch(request, /api/auth/login, { method: 'POST', data: { username, password } });
  if (!res.ok()) throw new Error(login failed: .status());
  const body = await res.json();
  return body.accessToken ??body.token ?? '';
}

export async function loginAsAdmin(request: APIRequestContext): Promise<string> {
  return loginUser(request, 'admin', 'password');
}

export async function ensureProduct(request: APIRequestContext, token: string, productName: string): Promise<number> {
  const res = await apiFetch(request, /api/products, { headers: { Authorization: Bearer  } });
  if (!res.ok()) throw new Error('Failed to fetch products');
  const products = await res.json();
  const existing = products.find(p => p.name === productName);
  if (existing) return existing.id;
  const createRes = await apiFetch(request, /api/products, { method: 'POST', headers: { Authorization: Bearer  }, data: { name: productName } });
  if (!createRes.ok()) throw new Error('Failed to create product');
  const created = await createRes.json();
  return created.id;
}

export async function createRelease(request: APIRequestContext, token: string, productId: number, name: string, version: string) {
  const res = await apiFetch(request, /api/releases, { method: 'POST', headers: { Authorization: Bearer  }, data: { productId, name, version } });
  if (!res.ok()) throw new Error(create release failed: );
  return res.json();
}

export {};
