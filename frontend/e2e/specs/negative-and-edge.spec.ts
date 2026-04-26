import { expect, test } from '@playwright/test';
import { createRelease, ensureProduct, loginUser, registerUser } from '../utils/api-client';
import { E2E, uniqueSuffix } from '../config/test-data';

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
});
