import { Page, Locator } from '@playwright/test';

export class ReleaseManagementPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
