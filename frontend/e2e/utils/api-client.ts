import { APIRequestContext, expect } from '@playwright/test';
import { E2E, randomEmail } from '../config/test-data';

type LoginResponse = { accessToken: string };
type ProductResponse = { id: number; name: string };
type ReleaseResponse = { id: number; name: string; status: string };
type AuditLogResponse = { action: string; entityName: string };

export async function login(request: APIRequestContext, username: string, password: string): Promise<string> {
  const response = await request.post(`${E2E.apiBaseUrl}/api/auth/login`, {
    data: { username, password }
  });
  expect(response.ok()).toBeTruthy();
  const body = (await response.json()) as LoginResponse;
  return body.accessToken;
}

export async function registerAdmin(request: APIRequestContext, username: string, password: string): Promise<string> {
  const registerResponse = await request.post(`${E2E.apiBaseUrl}/api/auth/register`, {
    data: {
      username,
      email: randomEmail(username),
      password,
      role: 'ADMIN'
    }
  });

  if (!registerResponse.ok()) {
    const maybeError = await registerResponse.json().catch(() => ({}));
    const message = String((maybeError as { error?: string }).error ?? '');
    throw new Error(`Failed to register admin: ${registerResponse.status()} ${message}`);
  }

  return login(request, username, password);
}

export async function registerViewer(request: APIRequestContext, username: string, password: string): Promise<string> {
  const registerResponse = await request.post(`${E2E.apiBaseUrl}/api/auth/register`, {
    data: {
      username,
      email: randomEmail(username),
      password,
      role: 'VIEWER'
    }
  });

  if (!registerResponse.ok()) {
    const maybeError = await registerResponse.json().catch(() => ({}));
    const message = String((maybeError as { error?: string }).error ?? '');
    if (!message.toLowerCase().includes('already exists')) {
      throw new Error(`Failed to register viewer: ${registerResponse.status()} ${message}`);
    }
  }

  return login(request, username, password);
}

export async function ensureProduct(request: APIRequestContext, adminToken: string, productName: string): Promise<number> {
  const listResponse = await request.get(`${E2E.apiBaseUrl}/api/products`, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });
  expect(listResponse.ok()).toBeTruthy();
  const products = (await listResponse.json()) as ProductResponse[];
  const existing = products.find((product) => product.name === productName);
  if (existing) {
    return existing.id;
  }

  const createResponse = await request.post(`${E2E.apiBaseUrl}/api/products`, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    },
    data: {
      name: productName,
      description: 'Created by Playwright E2E setup'
    }
  });
  expect(createResponse.ok()).toBeTruthy();
  const created = (await createResponse.json()) as ProductResponse;
  return created.id;
}

export async function createReleaseApi(
  request: APIRequestContext,
  token: string,
  payload: { productId: number; version: string; name: string }
): Promise<ReleaseResponse> {
  const response = await request.post(`${E2E.apiBaseUrl}/api/releases`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: payload
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as ReleaseResponse;
}

export async function getReleaseByName(
  request: APIRequestContext,
  token: string,
  releaseName: string
): Promise<ReleaseResponse | undefined> {
  const response = await request.get(`${E2E.apiBaseUrl}/api/releases`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok()) {
    return undefined;
  }
  const releases = (await response.json()) as ReleaseResponse[];
  return releases.find((release) => release.name === releaseName);
}

export async function getAuditLogs(request: APIRequestContext, token: string): Promise<AuditLogResponse[]> {
  const response = await request.get(`${E2E.apiBaseUrl}/api/audit-logs`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  expect(response.ok()).toBeTruthy();
  return (await response.json()) as AuditLogResponse[];
}

export async function exportReleasesCsv(request: APIRequestContext, token: string): Promise<string> {
  const response = await request.get(`${E2E.apiBaseUrl}/api/releases/export.csv`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  expect(response.ok()).toBeTruthy();
  const contentType = response.headers()['content-type'] ?? '';
  expect(contentType).toContain('text/csv');
  return response.text();
}
