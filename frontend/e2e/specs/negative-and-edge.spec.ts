import { expect, test } from '@playwright/test';
import { createRelease, ensureProduct, loginUser, registerUser } from '../utils/api-client';
import { E2E, uniqueSuffix } from '../config/test-data';
import { AuthPage } from '../pages/auth.page';
import { ReleaseManagementPage } from '../pages/release-management.page';

function generateName(n: number): string {
	return 'a'.repeat(n);
}

test.describe('Negative and edge cases', () => {
	test('unauthenticated access redirects to login', async ({ page }) => {
		await page.goto('/releases');
		await expect(page).toHaveURL(/\/login$/);
	});

	test('invalid route resolves without application crash', async ({ page }) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page).toHaveURL(/\/login$|\/$/);
		await expect(page.locator('app-root')).toBeVisible();
	});

	test('empty release name triggers ng-invalid class', async ({ page, request }) => {
		const adminUsername = `edge-admin-${uniqueSuffix()}`;
		const adminPassword = E2E.adminPassword;
		const adminToken = await registerUser(request, {
			username: adminUsername,
			email: `${adminUsername}@rmt.e2e.local`,
			password: adminPassword,
			role: 'ADMIN'
		});

		const productName = `edge-product-${uniqueSuffix()}`;
		await ensureProduct(request, adminToken, productName);

		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.login(adminUsername, adminPassword);

		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.productSelect.selectOption({ label: productName });
		await releasePage.versionInput.fill('1.0.0-edge');
		await releasePage.nameInput.fill('');
		await releasePage.createReleaseButton.click();

		await expect(releasePage.nameInput).toHaveClass(/ng-invalid/);
	});

	test('empty release name shows validation error text', async ({ page, request }) => {
		const adminUsername = `edge-admin-${uniqueSuffix()}`;
		const adminPassword = E2E.adminPassword;
		const adminToken = await registerUser(request, {
			username: adminUsername,
			email: `${adminUsername}@rmt.e2e.local`,
			password: adminPassword,
			role: 'ADMIN'
		});

		const productName = `edge-product-${uniqueSuffix()}`;
		await ensureProduct(request, adminToken, productName);

		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.login(adminUsername, adminPassword);

		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.productSelect.selectOption({ label: productName });
		await releasePage.versionInput.fill('1.0.0-edge');
		await releasePage.nameInput.fill('');
		await releasePage.createReleaseButton.click();

		await expect(releasePage.nameInput).toHaveClass(/ng-invalid/);
		const requiredError = page.locator('mat-error').filter({ hasText: /required/i }).first();
		await expect(requiredError).toBeVisible();
	});
});
