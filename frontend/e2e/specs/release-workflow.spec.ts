import { test, expect } from '@playwright/test';
import { registerUser, loginAsAdmin, ensureProduct, createRelease, transitionRelease } from '../utils/api-client';
import { AuthPage } from '../pages/auth.page';
import { ReleaseManagementPage } from '../pages/release-management.page';

test.describe('Admin release lifecycle', () => {
  test.beforeAll(async ({ browser }) => {
    const adminPage = await browser.newPage();
    const adminToken = await loginAsAdmin(adminPage.request);
    await ensureProduct(adminPage.request, adminToken, 'TestProduct');
    await adminPage.close();
  });

  test('admin can login and reach release management', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.login('admin', 'password');
    const releasePage = new ReleaseManagementPage(page);
    await releasePage.navigateToReleaseManagement();
    await expect(page.locator('h1:has-text("Releases")')).toBeVisible();
  });

  test('admin creates release in DRAFT state', async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.login('admin', 'password');
    const releasePage = new ReleaseManagementPage(page);
    await releasePage.navigateToReleaseManagement();
    const releaseName = 'Release-' + Date.now();
    await releasePage.createRelease(releaseName, '1.0.0');
    await releasePage.waitForState(releaseName, 'DRAFT');
    await expect(page.locator('text=DRAFT')).toBeVisible();
  });

  test('admin transitions release from DRAFT to TESTING', async ({ page }) => {
    const releasePage = new ReleaseManagementPage(page);
    await releasePage.transitionRelease('Release-' + Date.now(), 'TESTING');
    await expect(page.locator('text=TESTING')).toBeVisible();
  });

  test('admin transitions release from TESTING to APPROVED', async ({ page }) => {
    const releasePage = new ReleaseManagementPage(page);
    await releasePage.transitionRelease('Release-' + Date.now(), 'APPROVED');
    await expect(page.locator('text=APPROVED')).toBeVisible();
  });

  test('admin transitions release from APPROVED to RELEASED', async ({ page }) => {
    const releasePage = new ReleaseManagementPage(page);
    await releasePage.transitionRelease('Release-' + Date.now(), 'RELEASED');
    await expect(page.locator('text=RELEASED')).toBeVisible();
  });
});
