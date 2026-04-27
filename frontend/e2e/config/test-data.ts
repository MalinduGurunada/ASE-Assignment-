export const E2E = {
  apiBaseUrl: process.env.PW_API_BASE_URL ?? 'http://localhost:8080',
  adminUsername: process.env.PW_ADMIN_USERNAME ?? 'admin',
  adminPassword: process.env.PW_ADMIN_PASSWORD ?? 'password',
  viewerPassword: process.env.PW_VIEWER_PASSWORD ?? 'Viewer#12345',
  defaultReleaseVersion: '1.0.0-e2e'
};

export function uniqueSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

export function randomViewerUsername(): string {
  return `viewer-${uniqueSuffix()}`;
}

export function randomEmail(prefix: string): string {
  return `${prefix}.${uniqueSuffix()}@rmt.e2e.local`;
}
