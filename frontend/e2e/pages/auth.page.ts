import { Page, Locator } from '@playwright/test';

export class AuthPage {
  private page: Page;
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.navigate();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForNavigation();
  }
}
