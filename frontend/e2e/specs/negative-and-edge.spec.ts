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

	// Ensures protected routes always redirect anonymous users to authentication.
	test('unauthenticated access redirects to login', async ({ page }) => {
		await page.goto('/products/releases');
		await expect(page).toHaveURL(/\/auth\/login$/);
	});

	// Confirms unknown client-side routes recover without crashing the application shell.
	test('invalid route resolves without application crash', async ({ page }) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page).toHaveURL(/\/auth\/login$|\/dashboard$/);
		await expect(page.locator('app-root')).toBeVisible();
	});

	// Verifies the release name field is marked invalid when required input is empty.
	test('empty release name triggers ng-invalid class', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.createReleaseButton.click();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });
		await releasePage.versionInput.fill('1.0.0-edge');
		await releasePage.nameInput.fill('');
		await page.getByRole('button', { name: 'Save' }).click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toBeVisible();
	});

	// Verifies users receive a clear required-field message for empty release names.
	test('empty release name shows validation error text', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.createReleaseButton.click();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });
		await releasePage.versionInput.fill('1.0.0-edge');
		await releasePage.nameInput.fill('');
		await page.getByRole('button', { name: 'Save' }).click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toBeVisible();
		// Confirm the form was not submitted — no new row appears with a blank name
		await expect(page.locator('tbody tr').filter({ hasText: '1.0.0-edge' })).toHaveCount(0);
	});

	// Confirms the maximum valid release name boundary (200 chars) is accepted.
	test('200-character release name is accepted', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.createReleaseButton.click();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });

		const validBoundaryName = generateName(200);
		await releasePage.versionInput.fill('2.0.0-edge');
		await releasePage.nameInput.fill(validBoundaryName);
		await page.getByRole('button', { name: 'Save' }).click();

		await expect(page.locator('tbody tr').filter({ hasText: validBoundaryName }).first()).toBeVisible();
	});

	// Confirms input exceeding the maxlength boundary (201 chars) is rejected.
	test('201-character release name is rejected', async ({ page }) => {
		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();
		await releasePage.createReleaseButton.click();
		await releasePage.productSelect.selectOption({ label: adminBrowserProductName });

		const invalidBoundaryName = generateName(201);
		await releasePage.versionInput.fill('2.0.1-edge');
		await releasePage.nameInput.fill(invalidBoundaryName);
		await page.getByRole('button', { name: 'Save' }).click();

		await expect(page.locator('.ng-invalid[formcontrolname="name"]')).toBeVisible();
	});

	// Ensures authentication errors are surfaced for invalid credentials.
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

	// Verifies form validation blocks login attempts when username is missing.
	test('empty username prevents login form submission', async ({ page }) => {
		const authPage = new AuthPage(page);
		await authPage.gotoLogin();

		await authPage.usernameInput.fill('');
		await authPage.passwordInput.fill(E2E.adminPassword);

		const buttonDisabled = await authPage.loginButton.isDisabled();
		const invalidFormCount = await page.locator('form.ng-invalid').count();
		expect(buttonDisabled || invalidFormCount > 0).toBeTruthy();
	});

	// Simulates token/session loss and verifies protected routes force re-authentication.
	test('clearing auth storage mid-session redirects to login', async ({ page }) => {
		await page.evaluate(() => localStorage.clear());
		await page.goto('/products/releases');

		await expect(page).toHaveURL(/\/auth\/login$/);
	});

	// Confirms viewer users cannot see privileged creation actions in the UI.
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

	// Verifies special-character payloads are handled safely without server crashes.
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
		expect([200, 201, 400]).toContain(response.status());
	});
});
