import { test } from '@playwright/test';
import { createRelease, ensureProduct, loginUser, registerUser } from '../utils/api-client';
import { E2E, uniqueSuffix } from '../config/test-data';

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

	test.beforeAll(async ({ request }) => {
		adminToken = await registerUser(request, {
			username: adminCreds.username,
			email: `${adminCreds.username}@rmt.e2e.local`,
			password: adminCreds.password,
			role: 'ADMIN'
		});

		viewerToken = await registerUser(request, {
			username: viewerCreds.username,
			email: `${viewerCreds.username}@rmt.e2e.local`,
			password: viewerCreds.password,
			role: 'VIEWER'
		});
	});
});
