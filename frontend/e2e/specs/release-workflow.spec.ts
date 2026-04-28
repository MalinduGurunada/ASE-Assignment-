import { expect, test } from '@playwright/test';
import {
  createRelease,
  ensureProduct,
  exportAndVerifyCsv,
  getAuditLogs,
  loginUser,
  registerUser,
  transitionRelease
} from '../utils/api-client';
import { E2E, uniqueSuffix } from '../config/test-data';
import { AuthPage } from '../pages/auth.page';
import { ReleaseManagementPage } from '../pages/release-management.page';

test.describe.configure({ mode: 'serial' });

test.describe('Admin release lifecycle', () => {
  const adminCreds = {
    username: `workflow-admin-${uniqueSuffix()}`,
    password: E2E.adminPassword
  };

  let adminToken = '';
  let productId = 0;
  let apiReleaseName = '';
  let apiReleaseId = 0;

  test.beforeAll(async ({ request }) => {
    adminToken = await registerUser(request, {
      username: adminCreds.username,
      email: `${adminCreds.username}@rmt.e2e.local`,
      password: adminCreds.password,
      role: 'ADMIN'
    });

    productId = await ensureProduct(request, adminToken, `workflow-product-${uniqueSuffix()}`);
    apiReleaseName = `workflow-release-${uniqueSuffix()}`;
    const release = await createRelease(request, adminToken, {
      productId,
      version: '1.0.0-workflow',
      name: apiReleaseName
    });
    apiReleaseId = release.id;
  });

  test('admin can login and reach release management', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.login(adminCreds.username, adminCreds.password);

    const releasePage = new ReleaseManagementPage(page);
    await releasePage.navigateToReleaseManagement();
    await expect(page.getByRole('heading', { name: 'Releases' })).toBeVisible();
  });

  test('admin creates release in DRAFT state through UI', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.login(adminCreds.username, adminCreds.password);

    const releasePage = new ReleaseManagementPage(page);
    await releasePage.navigateToReleaseManagement();

    const releaseName = `ui-release-${uniqueSuffix()}`;
    await releasePage.createRelease(releaseName, '1.0.0-ui');
    await releasePage.waitForState(releaseName, 'DRAFT');
  });

  test('admin transitions release from DRAFT to TESTING to APPROVED to RELEASED', async ({ request }) => {
    adminToken = await loginUser(request, adminCreds.username, adminCreds.password);

    let release = await transitionRelease(request, adminToken, apiReleaseId, 'TESTING');
    expect(release.status).toBe('TESTING');

    release = await transitionRelease(request, adminToken, apiReleaseId, 'APPROVED');
    expect(release.status).toBe('APPROVED');

    release = await transitionRelease(request, adminToken, apiReleaseId, 'RELEASED');
    expect(release.status).toBe('RELEASED');
  });

  test('verify audit logs and CSV export', async ({ request }) => {
    adminToken = await loginUser(request, adminCreds.username, adminCreds.password);

    const logs = await getAuditLogs(request, adminToken);
    expect(logs.length).toBeGreaterThanOrEqual(3);

    const csvContainsRelease = await exportAndVerifyCsv(request, adminToken, apiReleaseName);
    expect(csvContainsRelease).toBeTruthy();
  });
});
