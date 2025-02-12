import { Page, Locator, expect } from '@playwright/test';  // Importar expect

export class ProjectPage {
  private page: Page;
  private projectNameInput: Locator;
  private projectNumberInput: Locator;
  private dateInput: Locator;
  private nextButton: Locator;
  private finishButton: Locator;
  private createCircuitButton: Locator;
  private saveButton: Locator;
  private openProjectButton: Locator;
  private designActiveCircuitButton: Locator; // Nuevo
  private images: Locator; // Nuevo

  constructor(page: Page) {
    this.page = page;
    this.projectNameInput = page.locator('input[name="projectName"]');
    this.projectNumberInput = page.locator('input[name="projectNumber"]');
    this.dateInput = page.getByRole('textbox', { name: 'MM/DD/YYYY' }).first();
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.createCircuitButton = page.getByLabel('Create Circuit').getByRole('button');
    this.saveButton = page.getByLabel('Save').getByRole('button');
    this.openProjectButton = page.getByText('Open Project');
    this.designActiveCircuitButton = page.getByLabel('Design Active Circuit').getByRole('button');  // Nuevo
    this.images = page.getByRole('img', { name: 'text' }); // Nuevo
  }

  async fillProjectDetails(name: string, number: string, date: string) {
    await this.projectNameInput.fill(name);
    await this.projectNumberInput.fill(number);
    await this.dateInput.fill(date);
  }

  async completeProjectCreation() {
    for (let i = 0; i < 3; i++) {
      await this.nextButton.waitFor({ state: 'visible', timeout: 20000 });
      await this.waitForElementEnabled(this.nextButton, 20000);
      await this.nextButton.click();
      await this.page.waitForTimeout(2000);
    }

    await this.finishButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.finishButton, 20000);
    await this.finishButton.click();
  }

  async createCircuit() {
    console.log('Creando circuito...');
    await this.createCircuitButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.createCircuitButton, 20000);
    await this.createCircuitButton.click();
    await this.page.waitForTimeout(15000);

    console.log('Esperando circuito en UI...');
    const circuitLocator = this.page.locator('[data-testid^="rf__node-"]');
    await circuitLocator.first().waitFor({ state: 'visible', timeout: 30000 });
    await circuitLocator.first().click();

    await this.saveButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.saveButton, 20000);
    await this.saveButton.click();
    await this.page.waitForTimeout(7000);
  }

  async openProject(projectName: string) {
    console.log(`Buscando proyecto: ${projectName}`);
    await this.page.getByRole('button', { name: new RegExp(`${projectName}`, 'i') }).click();
    await this.openProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.openProjectButton, 20000);
    await this.openProjectButton.click();
  }

  // Nueva funcionalidad para diseñar y validar imágenes
  async designActiveCircuitAndValidateImages() {
  await this.page.getByRole('tab', { name: 'Design Results' }).first().click();
  await this.page.waitForTimeout(3000); 
  await this.page.getByRole('tab', { name: 'Design Results' }).nth(1).click();
  await this.page.waitForTimeout(3000); 
  await expect(this.images.nth(1)).toBeVisible({ timeout: 3000 }); 
  await this.images.first().click();
  await this.images.nth(1).click();
  await expect(this.page.getByText('Circuit: Success Segment: Success')).toBeVisible({ timeout: 4000 });
  await this.page.waitForTimeout(3000); 
  }

  async openProjectAndValidate(projectName: string, projectNumber: number) {
    await this.openProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.openProjectButton, 20000);
    await this.openProjectButton.click();

    await this.page.waitForSelector('.project-details');
    
    const projectTitle = await this.page.textContent('.project-title');
    expect(projectTitle).toBe(projectName);

    const projectNumberText = await this.page.textContent('.project-number');
    expect(projectNumberText).toContain(projectNumber.toString());
  }

  private async waitForElementEnabled(element: Locator, timeout = 20000) {
    await element.waitFor({ state: 'visible', timeout });
    await element.evaluate((el) => {
      if (el instanceof HTMLButtonElement && el.disabled) {
        throw new Error('Element is not enabled');
      }
    }, { timeout });
  }
}
