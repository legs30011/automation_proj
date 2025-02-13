import { Page , Locator, expect } from '@playwright/test';

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
    await this.page.waitForTimeout(5000);
  }

  async selectProjectFromList(projectName: string) {
    console.log(`Buscando proyecto: ${projectName}`);
    const projectItem = this.page.locator(`[role="menuitem"]:has-text("${projectName}")`);
  
    await projectItem.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForSelector('[role="menuitem"]', { timeout: 20000 });
  
    try {
      const confirmButton = this.page.getByRole('menuitem', {
        name: new RegExp(`${projectName} Are you sure to`, 'i'),
      });
  
      if (await confirmButton.isVisible({ timeout: 5000 })) {
        console.log('⚠️ Apareció el mensaje de confirmación, haciendo clic...');
        await confirmButton.click();
        await this.page.waitForTimeout(3000);
      } else {
        console.log('✅ No apareció el diálogo de confirmación, continuando...');
      }
    } catch (error) {
      console.log('❌ Error al manejar la confirmación:', error);
    }
    await this.page.waitForTimeout(4000);
  
    const circuitCountCell = this.page.locator('.MuiDataGrid-row > div:nth-child(6)').first();
    await circuitCountCell.waitFor({ state: 'attached', timeout: 10000 });
  
    const text = (await circuitCountCell.textContent())?.trim() || '';
    console.log('Texto actual:', text);
  
    // Check if the text is 1 or greater, but not 0
    if (parseInt(text) >= 1) {
      console.log('✅ Circuit count is correct.');
    } else {
      console.error(`❌ Expected a number greater than or equal to 1, but got "${text}"`);
    }
  
    await expect(circuitCountCell).toHaveText(/^[1-9][0-9]*$/, { timeout: 15000 }); // Regex to ensure the value is greater than or equal to 1
    await this.page.waitForTimeout(4000);
  }

  async selectProjectFromListAndValidateTwo(projectName: string) {
    console.log(`Searching for project: ${projectName}`);
    const projectItem = this.page.locator(`[role="menuitem"]:has-text("${projectName}")`);
  
    await projectItem.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForSelector('[role="menuitem"]', { timeout: 20000 });
  
    try {
      const confirmButton = this.page.getByRole('menuitem', {
        name: new RegExp(`${projectName} Are you sure to`, 'i'),
      });
  
      if (await confirmButton.isVisible({ timeout: 5000 })) {
        console.log('⚠️ Confirmation dialog appeared, clicking...');
        await confirmButton.click();
        await this.page.waitForTimeout(3000);
      } else {
        console.log('✅ Confirmation dialog did not appear, continuing...');
      }
    } catch (error) {
      console.log('❌ Error handling confirmation:', error);
    }
    await this.page.waitForTimeout(4000);
  
    // Validate that positions 6 and 7 have the value 2
    const circuitCountCell6 = this.page.locator('.MuiDataGrid-row > div:nth-child(6)').first();
    await circuitCountCell6.waitFor({ state: 'attached', timeout: 10000 });
    const text6 = (await circuitCountCell6.textContent())?.trim() || '';
    console.log('Text in position 6:', text6);
  
    if (text6 === "2") {
      console.log('✅ Position 6 has the value 2.');
    } else {
      console.error(`❌ Expected "2" in position 6, but got "${text6}"`);
    }
  
    const circuitCountCell7 = this.page.locator('.MuiDataGrid-row > div:nth-child(7)').first();
    await circuitCountCell7.waitFor({ state: 'attached', timeout: 10000 });
    const text7 = (await circuitCountCell7.textContent())?.trim() || '';
    console.log('Text in position 7:', text7);
  
    if (text7 === "2") {
      console.log('✅ Position 7 has the value 2.');
    } else {
      console.error(`❌ Expected "2" in position 7, but got "${text7}"`);
    }
  
    // Additional validation for other positions if needed
    const circuitCountCell = this.page.locator('.MuiDataGrid-row > div:nth-child(6)').first();
    await circuitCountCell.waitFor({ state: 'attached', timeout: 10000 });
    const text = (await circuitCountCell.textContent())?.trim() || '';
    console.log('Current text:', text);
  
    if (parseInt(text) >= 1) {
      console.log('✅ Circuit count is correct.');
    } else {
      console.error(`❌ Expected a number greater than or equal to 1, but got "${text}"`);
    }
  
    await expect(circuitCountCell).toHaveText(/^[1-9][0-9]*$/, { timeout: 15000 });
    await this.page.waitForTimeout(4000);
  }
  
  
  
  async openProjectsInCache() {
    await this.projectsInCacheButton.waitFor({ state: 'visible', timeout: 30000 });
    await this.projectsInCacheButton.click();
  }

  async DesignProject() {
    console.log('Creando circuito...');
    await this.createCircuitButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.createCircuitButton, 20000);
    await this.createCircuitButton.click();
    await this.page.waitForTimeout(5000);

    console.log('Esperando circuito en UI...');
    const circuitLocator = this.page.locator('[data-testid^="rf__node-"]');
    await circuitLocator.first().waitFor({ state: 'visible', timeout: 20000 });
    await circuitLocator.first().click();

    await this.saveButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.saveButton, 20000);

    console.log('Diseñando circuito...');
    await this.DesignProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.DesignProjectButton.click();
    await this.page.waitForTimeout(15000);

    console.log('Validando imágenes...');
    const images = this.page.getByRole('img', { name: 'text' });
    await expect(images.first()).toBeVisible({ timeout: 15000 });
    await expect(images.nth(1)).toBeVisible({ timeout: 15000 });
    await images.first().click();
    await this.saveButton.click();
    await this.page.waitForTimeout(5000);
  }
  async designActiveCircuitAndValidateImages() {
    const images = this.page.getByRole('img', { name: 'text' });
    await this.page.getByRole('tab', { name: 'Design Results' }).first().click();
    await this.page.waitForTimeout(3000); 
    await this.page.getByRole('tab', { name: 'Design Results' }).nth(1).click();
    await this.page.waitForTimeout(3000); 
    await expect(images.nth(1)).toBeVisible({ timeout: 3000 }); 
    await images.first().click();
    await images.nth(1).click();
    await expect(this.page.getByText('Circuit: Success Segment: Success')).toBeVisible({ timeout: 4000 });
    await this.page.waitForTimeout(3000);
}


  private async waitForElementEnabled(locator: Locator, timeout: number) {
    await this.page.waitForFunction(
      async (el) => !(el as HTMLElement).hasAttribute('disabled'),
      await locator.elementHandle(), 
      { timeout }
    );
  }
}  
