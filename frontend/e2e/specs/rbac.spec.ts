import { expect, test } from '@playwright/test';
import { createRelease, ensureProduct, loginUser, registerUser } from '../utils/api-client';
import { E2E, uniqueSuffix } from '../config/test-data';
import { AuthPage } from '../pages/auth.page';
import { ReleaseManagementPage } from '../pages/release-management.page';

test.describe('RBAC enforcement', () => {
	const adminCreds = {
		username: `rbac-admin-${uniqueSuffix()}`,
		password: E2E.adminPassword
	};
	const viewerCreds = {
		username: `rbac-viewer-${uniqueSuffix()}`,
		password: E2E.viewerPassword
	};

	let adminToken = '';
	let viewerToken = '';
	let releaseId = 0;

	test.beforeAll(async ({ request }) => {
		adminToken = await registerUser(request, {
			username: adminCreds.username,
			email: `${adminCreds.username}@rmt.e2e.local`,
			password: adminCreds.password,
			role: 'ADMIN'
		});

		const viewerRegistrationBody = {
			username: viewerCreds.username,
			email: `${viewerCreds.username}@rmt.e2e.local`,
			password: viewerCreds.password,
			role: 'VIEWER' as const
		};
		viewerToken = await registerUser(request, viewerRegistrationBody);

		const productId = await ensureProduct(request, adminToken, `rbac-product-${uniqueSuffix()}`);
		const createdRelease = await createRelease(request, adminToken, {
			productId,
			version: '1.0.0-rbac',
			name: `rbac-release-${uniqueSuffix()}`
		});
		releaseId = createdRelease.id;
	});

	test.beforeEach(async ({ request }) => {
		viewerToken = await loginUser(request, viewerCreds.username, viewerCreds.password);
	});

	// Verifies that viewer credentials authenticate successfully and return a JWT.
	test('viewer credentials produce a valid token', async () => {
		expect(typeof viewerToken).toBe('string');
		expect(viewerToken.length).toBeGreaterThan(0);
	});

	// Verifies that a viewer cannot invoke privileged release state transitions.
	test('viewer gets 403 on state transition endpoint', async ({ request }) => {
		const response = await request.post(`${E2E.apiBaseUrl}/api/releases/${releaseId}/transition`, {
			headers: {
				Authorization: `Bearer ${viewerToken}`
			},
			data: {
				targetStatus: 'TESTING'
			}
		});

		expect(response.status()).toBe(403);
		const responseBody = await response.json().catch(() => ({}));
		const responseText = JSON.stringify(responseBody);
		expect(/Access Denied|Forbidden/i.test(responseText)).toBeTruthy();
	});

	// Verifies the same endpoint is healthy for an authorized admin role.
	test('admin can successfully transition the same release', async ({ request }) => {
		const response = await request.post(`${E2E.apiBaseUrl}/api/releases/${releaseId}/transition`, {
			headers: {
				Authorization: `Bearer ${adminToken}`
			},
			data: {
				targetStatus: 'TESTING'
			}
		});

		expect(response.status()).toBe(200);
	});

	// Verifies a viewer cannot create releases through direct API calls.
	test('viewer gets 403 on POST /api/releases', async ({ request }) => {
		const response = await request.post(`${E2E.apiBaseUrl}/api/releases`, {
			headers: {
				Authorization: `Bearer ${viewerToken}`
			},
			data: {
				productId: 1,
				version: '9.9.9-viewer',
				name: 'viewer-created-release'
			}
		});

		expect(response.status()).toBe(403);
	});

	// Verifies a viewer cannot update existing releases.
	test('viewer gets 403 on PUT /api/releases/:id', async ({ request }) => {
		const response = await request.put(`${E2E.apiBaseUrl}/api/releases/${releaseId}`, {
			headers: {
				Authorization: `Bearer ${viewerToken}`
			},
			data: {
				name: 'updated-by-viewer',
				version: '1.0.1-viewer'
			}
		});

		expect(response.status()).toBe(403);
	});

	// Verifies a viewer cannot delete releases.
	test('viewer gets 403 on DELETE /api/releases/:id', async ({ request }) => {
		const response = await request.delete(`${E2E.apiBaseUrl}/api/releases/${releaseId}`, {
			headers: {
				Authorization: `Bearer ${viewerToken}`
			}
		});

		expect(response.status()).toBe(403);
	});

	// Verifies read-only access remains available to the viewer role.
	test('viewer can read releases (GET is permitted)', async ({ request }) => {
		const response = await request.get(`${E2E.apiBaseUrl}/api/releases`, {
			headers: {
				Authorization: `Bearer ${viewerToken}`
			}
		});

		expect(response.status()).toBe(200);
		const body = await response.json();
		expect(Array.isArray(body)).toBeTruthy();
	});

	// Verifies the viewer UI hides release creation controls.
	test('viewer UI shows no Create Release button', async ({ page }) => {
		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.login(viewerCreds.username, viewerCreds.password);

		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();

		await expect(releasePage.createReleaseButton).toBeHidden();
	});

	// Verifies the viewer UI hides transition action controls.
	test('viewer UI shows no state transition buttons', async ({ page }) => {
		const authPage = new AuthPage(page);
		await authPage.gotoLogin();
		await authPage.login(viewerCreds.username, viewerCreds.password);

		const releasePage = new ReleaseManagementPage(page);
		await releasePage.goto();

		const transitionButtons = page.getByRole('button', { name: /Move to/i });
		await expect(transitionButtons).toHaveCount(0);
	});
});
