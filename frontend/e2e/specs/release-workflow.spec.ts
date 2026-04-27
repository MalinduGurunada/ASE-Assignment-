import { test, expect } from '@playwright/test';
import { registerUser, loginAsAdmin, ensureProduct, createRelease } from '../utils/api-client';
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
});
