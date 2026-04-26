import { expect, test } from '@playwright/test';
import { createRelease, ensureProduct, loginUser, registerUser } from '../utils/api-client';
import { E2E, uniqueSuffix } from '../config/test-data';
import { AuthPage } from '../pages/auth.page';
import { ReleaseManagementPage } from '../pages/release-management.page';

function generateName(n: number): string {
	return 'a'.repeat(n);
}

const adminBrowserTestTitles = new Set([
	'empty release name triggers ng-invalid class',
	'empty release name shows validation error text',
	'200-character release name is accepted',
	'201-character release name is rejected',
	'clearing auth storage mid-session redirects to login'
]);

test.describe('Negative and edge cases', () => {
	let adminBrowserProductName = '';

	test.beforeEach(async ({ page, request }, testInfo) => {
		if (!adminBrowserTestTitles.has(testInfo.title)) {
			return;
		}

		const adminUsername = `edge-admin-${uniqueSuffix()}`;
		const adminPassword = E2E.adminPassword;
		const adminToken = await registerUser(request, {
			username: adminUsername,
			email: `${adminUsername}@rmt.e2e.local`,
			password: adminPassword,
			role: 'ADMIN'
		});

		adminBrowserProductName = `edge-product-${uniqueSuffix()}`;
		await ensureProduct(request, adminToken, adminBrowserProductName);

		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.login(adminUsername, adminPassword);
	});

	test('unauthenticated access redirects to login', async ({ page }) => {
		await page.goto('/releases');
		await expect(page).toHaveURL(/\/login$/);
	});

	test('invalid route resolves without application crash', async ({ page }) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page).toHaveURL(/\/login$|\/$/);
		await expect(page.locator('app-root')).toBeVisible();
	});

	test('empty release name triggers ng-invalid class', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });
		await releasePage.versionInput.fill('1.0.0-edge');
		await releasePage.nameInput.fill('');
		await releasePage.createReleaseButton.click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toBeVisible();
	});

	test('empty release name shows validation error text', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });
		await releasePage.versionInput.fill('1.0.0-edge');
		await releasePage.nameInput.fill('');
		await releasePage.createReleaseButton.click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toBeVisible();
		const requiredError = page.locator('mat-error').filter({ hasText: /required/i }).first();
		await requiredError.waitFor({ state: 'visible', timeout: 5000 });
		await expect(requiredError).toBeVisible();
	});

	test('200-character release name is accepted', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });

		const validBoundaryName = generateName(200);
		await releasePage.versionInput.fill('2.0.0-edge');
		await releasePage.nameInput.fill(validBoundaryName);
		await releasePage.createReleaseButton.click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toHaveCount(0);
		await expect(page.locator('tbody tr').filter({ hasText: validBoundaryName }).first()).toBeVisible();
	});

	test('201-character release name is rejected', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });

		const invalidBoundaryName = generateName(201);
		await releasePage.versionInput.fill('2.0.1-edge');
		await releasePage.nameInput.fill(invalidBoundaryName);
		await releasePage.createReleaseButton.click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toBeVisible();
	});

	test('wrong password shows login error message', async ({ page, request }) => {
		const adminUsername = `edge-admin-${uniqueSuffix()}`;
		const adminPassword = E2E.adminPassword;
		await registerUser(request, {
			username: adminUsername,
			email: `${adminUsername}@rmt.e2e.local`,
			password: adminPassword,
			role: 'ADMIN'
		});

		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.usernameInput.fill(adminUsername);
		await authPage.passwordInput.fill(`${adminPassword}-wrong`);
		await authPage.loginButton.click();

		await authPage.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
		await expect(authPage.errorMessage).toBeVisible();
	});

	test('empty username prevents login form submission', async ({ page }) => {
		const authPage = new AuthPage(page);
		await authPage.gotoLogin();

		await authPage.usernameInput.fill('');
		await authPage.passwordInput.fill(E2E.adminPassword);

		const buttonDisabled = await authPage.loginButton.isDisabled();
		const invalidFormCount = await page.locator('form.ng-invalid').count();
		expect(buttonDisabled || invalidFormCount > 0).toBeTruthy();
	});

	test('clearing auth storage mid-session redirects to login', async ({ page }) => {
		await page.evaluate(() => localStorage.clear());
		await page.goto('/releases');

		await expect(page).toHaveURL(/\/login$/);
	});

	test('viewer does not see Create button in UI', async ({ page, request }) => {
		const viewerUsername = `edge-viewer-${uniqueSuffix()}`;
		const viewerPassword = E2E.viewerPassword;
		await registerUser(request, {
			username: viewerUsername,
			email: `${viewerUsername}@rmt.e2e.local`,
			password: viewerPassword,
			role: 'VIEWER'
		});

		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.login(viewerUsername, viewerPassword);

		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();

		await expect(releasePage.createReleaseButton).toHaveCount(0);
	});

	test('special characters in release name do not cause 500', async ({ request }) => {
		const adminUsername = `edge-admin-${uniqueSuffix()}`;
		const adminPassword = E2E.adminPassword;
		await registerUser(request, {
			username: adminUsername,
			email: `${adminUsername}@rmt.e2e.local`,
			password: adminPassword,
			role: 'ADMIN'
		});

		const adminToken = await loginUser(request, adminUsername, adminPassword);
		const productId = await ensureProduct(request, adminToken, `edge-product-${uniqueSuffix()}`);

		const response = await request.post(`${E2E.apiBaseUrl}/api/releases`, {
			headers: {
				Authorization: `Bearer ${adminToken}`
			},
			data: {
				productId,
				version: '3.0.0-edge',
				name: '<script>alert(1)</script>'
			}
		});

		expect(response.status()).not.toBe(500);
		expect([201, 400]).toContain(response.status());
	});
});
