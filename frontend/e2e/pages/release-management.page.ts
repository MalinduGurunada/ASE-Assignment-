import { expect, Locator, Page } from '@playwright/test';
import { ReleaseStatus } from '../types/release';

export class ReleaseManagementPage {
  readonly heading: Locator;
  readonly productSelect: Locator;
  readonly versionInput: Locator;
  readonly nameInput: Locator;
  readonly createReleaseButton: Locator;
  readonly exportCsvButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Release Management' });
    this.productSelect = page.getByLabel('Product');
    this.versionInput = page.getByLabel('Version');
    this.nameInput = page.getByLabel('Name');
    this.createReleaseButton = page.getByRole('button', { name: 'Create Release' });
    this.exportCsvButton = page.getByRole('button', { name: 'Export CSV' });
    this.errorMessage = page.locator('p.error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/products/releases');
    await expect(this.heading).toBeVisible();
  }

  async createRelease(productName: string, version: string, name: string): Promise<void> {
    await this.productSelect.selectOption({ label: productName });
    await this.versionInput.fill(version);
    await this.nameInput.fill(name);
    await this.createReleaseButton.click();
  }

  rowByReleaseName(name: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: name }).first();
  }

  async expectReleaseStatus(name: string, status: ReleaseStatus): Promise<void> {
    const row = this.rowByReleaseName(name);
    await expect(row).toBeVisible();
    await expect(row).toContainText(status);
  }

  async moveReleaseTo(name: string, nextStatus: Exclude<ReleaseStatus, 'DRAFT'>): Promise<void> {
    const row = this.rowByReleaseName(name);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: `Move to ${nextStatus}` }).click();
  }

  async clickExportCsvAndVerifyDownload(): Promise<void> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportCsvButton.click();
    const download = await downloadPromise;
    await expect(download.suggestedFilename()).toBe('releases.csv');
  }
}
