import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class DashboardPage {
  private page: Page;
  private dashboardButton: Locator;
  private createProjectButton: Locator;
  private projectsInCacheButton: Locator;
  private DesignProjectButton: Locator;
  private createCircuitButton: Locator;
  private saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardButton = page.getByRole('button', { name: 'dashboard' });
    this.createProjectButton = page.getByLabel('Create project').getByRole('button');
    this.projectsInCacheButton = page.getByRole('button', { name: 'Projects in Cache' });
    this.DesignProjectButton = page.getByLabel('Design Active Circuit').getByRole('button');
    this.createCircuitButton = page.getByLabel('Create Circuit').getByRole('button');
    this.saveButton = page.getByLabel('Save').getByRole('button');
  }

  async navigateToDashboard() {
    await this.dashboardButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.dashboardButton.click();
  }

  async createProject() {
    await this.createProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.createProjectButton.click();

    const circuitCountCell = this.page.locator('.MuiDataGrid-row > div:nth-child(6)').first();
    await circuitCountCell.waitFor({ state: 'attached', timeout: 10000 });

    const text = (await circuitCountCell.textContent())?.trim() || '';
    console.log('Texto actual:', text);
    if (text !== "1") {
      console.log(`Expected "1" but got "${text}"`);
    }

    await expect(circuitCountCell).toHaveText('1');
    await this.page.waitForTimeout(2000);
  }

  async selectProjectFromList(projectName: string) {
    const projectItem = this.page.locator(`[role="menuitem"]:has-text("${projectName}")`);
    await projectItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForSelector('[role="menuitem"]', { timeout: 10000 });

    try {
      const confirmButton = this.page.getByRole('menuitem', { name: new RegExp(`${projectName}`, 'i') })
        .getByLabel('Are you sure to discard the');

      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await this.page.waitForTimeout(3000);
      }
    } catch (error) {
      console.log('No confirmation dialog appeared.');
    }

    await this.page.getByRole('button', { name: new RegExp(`${projectName}`, 'i') }).click();
    await this.page.waitForTimeout(2000);

    /*const circuitCountCell = this.page.locator('.MuiDataGrid-row > div:nth-child(6)').first();
    await circuitCountCell.waitFor({ state: 'attached', timeout: 10000 });

    const text = (await circuitCountCell.textContent())?.trim() || '';
    console.log('Texto actual:', text);
    if (text !== "1") {
      console.log(`Expected "1" but got "${text}"`);
    }

    await expect(circuitCountCell).toHaveText('1');
    await this.page.waitForTimeout(2000);*/
  }

  async DesignProject() {
    await this.createCircuitButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.createCircuitButton, 20000);
    await this.createCircuitButton.click();

    const circuitLocator = this.page.locator('[data-testid^="rf__node-"]');
    await circuitLocator.first().waitFor({ state: 'visible', timeout: 20000 });
    await circuitLocator.first().click();

    await this.saveButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.saveButton, 20000);

    await this.DesignProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.DesignProjectButton.click();

    const images = this.page.getByRole('img', { name: 'text' });
    await expect(images.first()).toBeVisible({ timeout: 15000 });
    await expect(images.nth(1)).toBeVisible({ timeout: 15000 });
    await images.first().click();
    await images.nth(1).click();
    await this.page.waitForTimeout(3000);

    await this.saveButton.click();
  }

  async checkDesignResults() {
    const images = this.page.locator('img');
    await this.page.getByRole('tab', { name: 'Design Results' }).first().click();
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('tab', { name: 'Design Results' }).nth(1).click();
    await this.page.waitForTimeout(3000);
    await expect(images.nth(1)).toBeVisible({ timeout: 3000 });
    await images.first().click();
    await images.nth(1).click();
    await expect(this.page.getByText('Circuit: Success Segment: Success')).toBeVisible({ timeout: 4000 });
    await this.page.waitForTimeout(2000);
  }

  async openProjectsInCache() {
    await this.projectsInCacheButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.projectsInCacheButton.click();
  }

  private async waitForElementEnabled(element: Locator, timeout = 20000) {
    await element.waitFor({ state: 'visible', timeout });
    await element.evaluate((el) => {
      if (el instanceof HTMLButtonElement && el.disabled) {
        throw new Error('Element is not enabled');
      }
    });
  }
}