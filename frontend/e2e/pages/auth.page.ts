import { expect, Locator, Page } from '@playwright/test';

export class AuthPage {
  readonly signInHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.signInHeading = page.getByRole('heading', { name: 'Sign In' });
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Generate JWT' });
    this.successMessage = page.locator('p.success');
    this.errorMessage = page.locator('p.error');
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/auth/login');
    await expect(this.signInHeading).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await expect(this.successMessage).toContainText('Login succeeded');
  }
}
