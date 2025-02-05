import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private loginButton: Locator;
  private emailInput: Locator;
  private nextButton: Locator;
  private passwordInput: Locator;
  private signInButton: Locator;
  private noButton: Locator;
  private closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('button:has-text("LOGIN")');
    this.emailInput = page.locator('input[type="email"]');
    this.nextButton = page.locator('input[type="submit"][value="Next"]');
    this.passwordInput = page.locator('input[type="password"][name="passwd"]');
    this.signInButton = page.locator('input[type="submit"][value="Sign in"]');
    this.noButton = page.getByRole('button', { name: 'No' });
    this.closeButton = page.getByRole('button', { name: 'Close' });
  }

  async navigate() {
    await this.page.goto('https://computrace7test.thermon-rd.com/', { waitUntil: 'domcontentloaded' });
    await this.loginButton.waitFor({ state: 'visible', timeout: 15000 }); // Wait for LOGIN button to be visible
  }

  async login(email: string, password: string) {
    
    console.log('Email:', email);
    console.log('Password:', password);

   
    await this.loginButton.click();

   
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    
    
    if (await this.emailInput.isVisible()) {
      console.log('Filling email:', email); 
      await this.emailInput.fill(email);
    } else {
      console.error('Email input is not visible!');
    }

    // Click on the "Next" button
    await this.nextButton.click();

    // Wait for the password input to be visible and fill the password
    await this.passwordInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.passwordInput.fill(password);

    // Click on the "Sign in" button
    await this.signInButton.click();

    // Wait and click the "No" button (if visible)
    await this.noButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.noButton.click();

    // Wait and click the "Close" button (if visible)
    await this.closeButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.closeButton.click();
  }
}
