import { Page, Locator } from '@playwright/test';

export class ReleaseManagementPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToReleaseManagement() {
    await this.page.locator('a:has-text("Releases")').click();
    await this.page.locator('h1:has-text("Releases")').waitFor();
  }

  async createRelease(name: string, version: string) {
    await this.page.locator('button:has-text("Create")').click();
    await this.page.locator('input[name="name"]').fill(name);
    await this.page.locator('input[name="version"]').fill(version);
    await this.page.locator('button:has-text("Submit")').click();
  }
}
