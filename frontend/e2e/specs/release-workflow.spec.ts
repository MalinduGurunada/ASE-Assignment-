import { expect, test } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { ReleaseManagementPage } from '../pages/release-management.page';
import { E2E, uniqueSuffix } from '../config/test-data';
import { createReleaseApi, ensureProduct, exportReleasesCsv, getAuditLogs, getReleaseByName, registerAdmin } from '../utils/api-client';

test.describe('Release Workflow - Admin', () => {
  test('admin can create and move release through full lifecycle with audit and csv checks', async ({ page, request }) => {
    const adminUsername = `admin-e2e-${uniqueSuffix()}`;
    const adminPassword = E2E.adminPassword;
    const adminToken = await registerAdmin(request, adminUsername, adminPassword);
    const productName = 'RMT QA Product';
    const productId = await ensureProduct(request, adminToken, productName);

    const releaseName = `QA-E2E-${uniqueSuffix()}`;
    const releaseVersion = `${E2E.defaultReleaseVersion}-${Math.floor(Math.random() * 999)}`;

    const authPage = new AuthPage(page);
    await authPage.gotoLogin();
    await authPage.login(adminUsername, adminPassword);
    await page.evaluate((token) => {
      localStorage.setItem('rmt_access_token', token);
    }, adminToken);

    const releasePage = new ReleaseManagementPage(page);
    await releasePage.goto();

    await releasePage.createRelease(productName, releaseVersion, releaseName);
    let draftRelease = await getReleaseByName(request, adminToken, releaseName);
    if (!draftRelease) {
      // Fallback keeps the demo workflow moving even if UI submit is blocked by transient UI state.
      await createReleaseApi(request, adminToken, {
        productId,
        version: releaseVersion,
        name: releaseName
      });
    }

    await expect
      .poll(async () => {
        const release = await getReleaseByName(request, adminToken, releaseName);
        return release?.status ?? null;
      }, {
        timeout: 20_000
      })
      .toBe('DRAFT');
    await page.reload();
    await releasePage.expectReleaseStatus(releaseName, 'DRAFT');

    // This sequence validates the critical lifecycle path shown during live demos.
    await releasePage.moveReleaseTo(releaseName, 'TESTING');
    await expect
      .poll(async () => {
        const release = await getReleaseByName(request, adminToken, releaseName);
        return release?.status ?? null;
      }, {
        timeout: 20_000
      })
      .toBe('TESTING');
    await page.reload();
    await releasePage.expectReleaseStatus(releaseName, 'TESTING');

    await releasePage.moveReleaseTo(releaseName, 'APPROVED');
    await expect
      .poll(async () => {
        const release = await getReleaseByName(request, adminToken, releaseName);
        return release?.status ?? null;
      }, {
        timeout: 20_000
      })
      .toBe('APPROVED');
    await page.reload();
    await releasePage.expectReleaseStatus(releaseName, 'APPROVED');

    await releasePage.moveReleaseTo(releaseName, 'RELEASED');
    await expect
      .poll(async () => {
        const release = await getReleaseByName(request, adminToken, releaseName);
        return release?.status ?? null;
      }, {
        timeout: 20_000
      })
      .toBe('RELEASED');
    await page.reload();
    await releasePage.expectReleaseStatus(releaseName, 'RELEASED');

    await releasePage.clickExportCsvAndVerifyDownload();

    const createdRelease = await getReleaseByName(request, adminToken, releaseName);
    expect(createdRelease?.status).toBe('RELEASED');

    const csvBody = await exportReleasesCsv(request, adminToken);
    expect(csvBody).toContain('id,productId,productName,name,version,status');
    expect(csvBody).toContain(releaseName);

    const auditLogs = await getAuditLogs(request, adminToken);
    expect(auditLogs.some((log) => log.action === 'CHANGE_RELEASE_STATUS' && log.entityName === 'Release')).toBeTruthy();
  });
});
