import { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/test-data';

async function apiFetch(request: APIRequestContext, path: string, options: any = {}) {
  const url = `${BASE_URL}${path}`;
  return request.fetch(url, options);
}

// scaffold: concrete helpers will be implemented in subsequent commits

export {};
