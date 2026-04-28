import { expect, Locator, Page } from '@playwright/test';

export class AuthPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[formcontrolname="username"]');
    this.passwordInput = page.locator('[formcontrolname="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.auth-alert-error');
  }

  async gotoLogin() {
    await this.page.goto('/auth/login');
  }

  async navigate() {
    await this.gotoLogin();
  }

  async login(username: string, password: string) {
    await this.gotoLogin();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.page).toHaveURL(/\/dashboard|\/products|\/deployments/, { timeout: 15_000 });
  }
}
