import { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/test-data';

type Role = 'ADMIN' | 'VIEWER';

type RegisterPayload = {
  username: string;
  email?: string;
  password: string;
  role: Role;
};

type ReleasePayload = {
  productId: number;
  version: string;
  name: string;
};

async function apiFetch(request: APIRequestContext, path: string, options: Parameters<APIRequestContext['fetch']>[1] = {}) {
  return request.fetch(`${BASE_URL}${path}`, options);
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function registerUser(
  request: APIRequestContext,
  payloadOrUsername: RegisterPayload | string,
  password?: string,
  role?: Role
): Promise<string> {
  const payload: RegisterPayload =
    typeof payloadOrUsername === 'string'
      ? {
          username: payloadOrUsername,
          email: `${payloadOrUsername}@e2e.local`,
          password: password ?? 'Password#12345',
          role: role ?? 'VIEWER'
        }
      : {
          ...payloadOrUsername,
          email: payloadOrUsername.email ?? `${payloadOrUsername.username}@e2e.local`
        };

  const res = await apiFetch(request, '/api/auth/register', { method: 'POST', data: payload });
  if (!res.ok()) {
    throw new Error(`register failed: ${res.status()} ${await res.text()}`);
  }

  const body = await res.json();
  return body.accessToken ?? body.token ?? '';
}

export async function loginUser(request: APIRequestContext, username: string, password: string): Promise<string> {
  const res = await apiFetch(request, '/api/auth/login', { method: 'POST', data: { username, password } });
  if (!res.ok()) {
    throw new Error(`login failed: ${res.status()} ${await res.text()}`);
  }

  const body = await res.json();
  return body.accessToken ?? body.token ?? '';
}

export async function loginAsAdmin(request: APIRequestContext): Promise<string> {
  const username = `admin-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return registerUser(request, {
    username,
    email: `${username}@e2e.local`,
    password: 'Password#12345',
    role: 'ADMIN'
  });
}

export async function ensureProduct(request: APIRequestContext, token: string, productName: string): Promise<number> {
  const listRes = await apiFetch(request, '/api/products', { headers: authHeader(token) });
  if (!listRes.ok()) {
    throw new Error(`failed to fetch products: ${listRes.status()} ${await listRes.text()}`);
  }

  const products = await listRes.json();
  const existing = products.find((product: { id: number; name: string }) => product.name === productName);
  if (existing) {
    return existing.id;
  }

  const createRes = await apiFetch(request, '/api/products', {
    method: 'POST',
    headers: authHeader(token),
    data: { name: productName, description: 'Created by Playwright E2E' }
  });
  if (!createRes.ok()) {
    throw new Error(`failed to create product: ${createRes.status()} ${await createRes.text()}`);
  }

  const created = await createRes.json();
  return created.id;
}

export async function createRelease(
  request: APIRequestContext,
  token: string,
  payloadOrProductId: ReleasePayload | number,
  name?: string,
  version?: string
) {
  const payload: ReleasePayload =
    typeof payloadOrProductId === 'number'
      ? { productId: payloadOrProductId, name: name ?? 'E2E release', version: version ?? '1.0.0' }
      : payloadOrProductId;

  const res = await apiFetch(request, '/api/releases', {
    method: 'POST',
    headers: authHeader(token),
    data: payload
  });
  if (!res.ok()) {
    throw new Error(`create release failed: ${res.status()} ${await res.text()}`);
  }

  return res.json();
}

export async function getReleaseByName(request: APIRequestContext, token: string, name: string) {
  const res = await apiFetch(request, '/api/releases', { headers: authHeader(token) });
  if (!res.ok()) {
    return undefined;
  }

  const releases = await res.json();
  return releases.find((release: { name: string }) => release.name === name);
}

export async function transitionRelease(request: APIRequestContext, token: string, releaseId: number, targetStatus: string) {
  const res = await apiFetch(request, `/api/releases/${releaseId}/transition`, {
    method: 'POST',
    headers: authHeader(token),
    data: { targetStatus }
  });
  if (!res.ok()) {
    throw new Error(`transition failed: ${res.status()} ${await res.text()}`);
  }

  return res.json();
}

export async function getAuditLogs(request: APIRequestContext, token: string) {
  const res = await apiFetch(request, '/api/audit-logs', { headers: authHeader(token) });
  if (!res.ok()) {
    throw new Error(`failed to fetch audit logs: ${res.status()} ${await res.text()}`);
  }

  return res.json();
}

export async function exportAndVerifyCsv(request: APIRequestContext, token: string, releaseName: string): Promise<boolean> {
  const res = await apiFetch(request, '/api/releases/export.csv', { headers: authHeader(token) });
  if (!res.ok()) {
    throw new Error(`failed to export CSV: ${res.status()} ${await res.text()}`);
  }

  const csv = await res.text();
  return csv.includes(releaseName);
}
