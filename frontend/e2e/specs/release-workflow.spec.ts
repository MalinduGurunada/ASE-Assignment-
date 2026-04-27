import { test, expect } from '@playwright/test';
import { registerUser, loginAsAdmin, ensureProductm, createRelease } from '../utils/api-client';

test.describe('Admin release lifecycle', () => {
  test.beforeAll(async ({ browser }) => {
    const adminPage = await browser.newPage();
    const adminToken = await loginAsAdmin(adminPage.request);
    await ensureProduct(adminPage.request, adminToken, 'TestProduct');
    await adminPage.close();
  });

  // tests will be added in next commits
});
