import { expect, Locator, Page } from '@playwright/test';

export class ReleaseManagementPage {
  readonly createReleaseButton: Locator;
  readonly productSelect: Locator;
  readonly versionInput: Locator;
  readonly nameInput: Locator;

  constructor(private readonly page: Page) {
    this.createReleaseButton = page.getByRole('button', { name: /Create release/i });
    this.productSelect = page.locator('[formcontrolname="productId"]');
    this.versionInput = page.locator('[formcontrolname="version"]');
    this.nameInput = page.locator('[formcontrolname="name"]');
  }

  async goto() {
    await this.page.goto('/products/releases');
    await expect(this.page.getByRole('heading', { name: 'Releases' })).toBeVisible();
  }

  async navigateToReleaseManagement() {
    await this.goto();
  }

  async createRelease(name: string, version: string) {
    await this.createReleaseButton.click();
    await this.productSelect.selectOption({ index: 1 });
    await this.versionInput.fill(version);
    await this.nameInput.fill(name);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async waitForState(releaseName: string, expectedState: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: releaseName }).first();
    await expect(row).toContainText(expectedState, { timeout: 15_000 });
  }

  async transitionRelease(releaseName: string, newState: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: releaseName }).first();
    await row.getByRole('button', { name: new RegExp(`Move.*${newState}`, 'i') }).click();
    await this.waitForState(releaseName, newState);
  }
}
