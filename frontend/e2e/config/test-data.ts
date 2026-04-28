export const BASE_URL = process.env.PW_API_BASE_URL ?? 'http://localhost:8080';

export const E2E = {
  appBaseUrl: process.env.PW_BASE_URL ?? 'http://localhost:4200',
  apiBaseUrl: BASE_URL,
  adminPassword: process.env.PW_ADMIN_PASSWORD ?? 'Password#12345',
  viewerPassword: process.env.PW_VIEWER_PASSWORD ?? 'Viewer#12345'
};

export const ADMIN_USER = {
  username: process.env.PW_ADMIN_USERNAME ?? 'admin',
  password: process.env.PW_ADMIN_PASSWORD ?? 'password'
};

export const VIEWER_USER = {
  username: process.env.PW_VIEWER_USERNAME ?? 'viewer',
  password: process.env.PW_VIEWER_PASSWORD ?? 'Viewer#12345'
};

export function uniqueSuffix(): string {
  return Date.now().toString(36);
}
