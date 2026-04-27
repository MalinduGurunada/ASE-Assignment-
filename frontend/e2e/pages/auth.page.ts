import { Page, Locator } from '@playwright/test';

export class AuthPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
