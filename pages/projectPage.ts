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
  private designActiveCircuitButton: Locator; 
  private images: Locator; 
  private DesignProjectButton: Locator; 

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
    this.images = page.getByRole('img', { name: 'text' }); 
    this.DesignProjectButton = page.getByLabel('Design Active Circuit').getByRole('button');

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

  async completeProjectCreationtest5() {
    for (let i = 0; i < 3; i++) {
      await this.nextButton.waitFor({ state: 'visible', timeout: 20000 });
      await this.waitForElementEnabled(this.nextButton, 20000);
      await this.nextButton.click();
      await this.page.waitForTimeout(2000);
      
      if (i === 0) {
        await this.page.getByRole('combobox', { name: 'NEC: Ordinary/Divisions' }).click();
        await this.page.getByRole('option', { name: 'IECEx: Ordinary/Zones' }).click();
      }
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

  async openProject3(projectName: string) {
    console.log(`Searching for project: ${projectName}`);
  await this.page.getByRole('button', { name: new RegExp(`${projectName}`, 'i') }).click();
  
  await this.openProjectButton.waitFor({ state: 'visible', timeout: 20000 });
  await this.waitForElementEnabled(this.openProjectButton, 20000);
  await this.openProjectButton.click();
  await this.page.waitForTimeout(5000);
  const designReferences = [
    { rowHeader: '0001 Owner: SVC CPTAutomation', icon: 'CheckIcon' },
    { rowHeader: '0003 Owner: SVC CPTAutomation', icon: 'path' }
  ];
  
  for (const reference of designReferences) {
    const rowHeaderLocator = this.page.getByRole('rowheader', { name: reference.rowHeader });
  
    // Verificar si el ícono CheckIcon está presente sin hacer clic
    if (reference.icon === 'CheckIcon') {
      const checkIconLocator = rowHeaderLocator.locator('[data-testid="CheckIcon"]');
      const isCheckIconVisible = await checkIconLocator.isVisible();
      
      if (isCheckIconVisible) {
        console.log('CheckIcon found for', reference.rowHeader);
      } else {
        console.log('CheckIcon not found for', reference.rowHeader);
      }
    } else if (reference.icon === 'path') {
      const pathLocator = rowHeaderLocator.locator('path');
      const isPathVisible = await pathLocator.isVisible();
  
      if (isPathVisible) {
        console.log('Path found for', reference.rowHeader);
      } else {
        console.log('Path not found for', reference.rowHeader);
      }
    }
  }  
}

  async openProject2(projectName: string) {
    console.log(`Searching for project: ${projectName}`);
    await this.page.getByRole('button', { name: new RegExp(`${projectName}`, 'i') }).click();
    
    await this.openProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.openProjectButton, 20000);
    await this.openProjectButton.click();
    await this.page.waitForTimeout(5000);
    const segment2Locator = this.page.getByRole('rowheader', { name: 'Segment 2' });
    if (await segment2Locator.isVisible()) {
      console.log('Segment 2 is visible. Clicking on Segment 2...');
      await segment2Locator.click();
    }
    await this.page.waitForTimeout(5000);
    const segment1Locator = this.page.getByRole('rowheader', { name: 'Segment 1' });
    if (await segment1Locator.isVisible()) {
      console.log('Segment 1 is visible. Clicking on Segment 1...');
      await segment1Locator.click();
    } else {
      console.log('Segment 1 is not visible.');
    }
  }
  

  async executeCircuitActions() {
    console.log('Executing circuit actions...');
    
    // Create circuit
    await this.createCircuitButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.createCircuitButton, 20000);
    await this.createCircuitButton.click();
    await this.page.waitForTimeout(15000); // Wait for circuit to be created
  
    console.log('Waiting for circuit in UI...');
    const circuitLocator = this.page.locator('[data-testid^="rf__node-"]');
    await circuitLocator.first().waitFor({ state: 'visible', timeout: 30000 });
    
    // Click on the first available node
    console.log('Clicking on the first node...');
    await circuitLocator.first().click({ button: 'right' });
  
    // Fill 'maintenanceTemp' field with a two-digit number (can change)
    console.log('Filling "maintenanceTemp" with value 42...');
    await this.page.locator('input[name="maintenanceTemp"]').click();
    await this.page.locator('input[name="maintenanceTemp"]').fill('42'); // Any two-digit value can be entered here
    await this.page.waitForTimeout(2000); // Wait to process the entered value
  
    // Select Design ReferenceSegment
    console.log('Selecting "Design ReferenceSegment"...');
    await this.page.locator('#root div').filter({ hasText: 'Design ReferenceSegment' }).nth(4).click();
    await this.page.waitForTimeout(3000); // Wait to ensure the segment is selected
  
    // Interactions with nodes
    console.log('Clicking on "0001"...');
    await this.page.getByText('0001', { exact: true }).click({ button: 'right' });
    await this.page.waitForTimeout(2000); // Wait after clicking
  
    console.log('Selecting "Copy Circuit"...');
    await this.page.getByRole('menuitem', { name: 'Copy Circuit' }).click();
    await this.page.waitForTimeout(2000); // Wait after the action
  
    // Repeat the same actions with node 0002
    console.log('Clicking on "0002"...');
    await this.page.getByText('0002', { exact: true }).click({ button: 'right' });
    await this.page.waitForTimeout(2000); // Wait after clicking
  
    console.log('Selecting "Copy Circuit"...');
    await this.page.getByRole('menuitem', { name: 'Copy Circuit' }).click();
    await this.page.waitForTimeout(2000); // Wait after the action
  
    // Click on node 0002
    console.log('Clicking on "0002"...');
    await this.page.getByText('0002').click();
    await this.page.waitForTimeout(2000); // Wait after clicking
  
    // Select 'Owner: SVC CPTAutomation'
    console.log('Clicking on "0002Owner: SVC CPTAutomation"...');
    await this.page.getByText('0002Owner: SVC CPTAutomation').click();
    await this.page.waitForTimeout(2000); // Wait to ensure the action is performed
  
    // Click on node 0002 and delete circuit
    console.log('Clicking on "0002"...');
    await this.page.getByText('0002').click({ button: 'right' });
    await this.page.waitForTimeout(2000); // Wait before deleting
  
    console.log('Selecting "Delete circuit"...');
    await this.page.getByRole('menuitem', { name: 'Delete circuit' }).click();
    await this.page.waitForTimeout(3000); // Wait to confirm the circuit is deleted
  
    // Create multiple active circuit
    console.log('Creating multiple active circuit...');
    await this.page.getByLabel('Design Multiple Active Circuit').getByRole('button').click();
    await this.page.waitForTimeout(20000);
    const progressValue = await this.page.locator('div').filter({ hasText: /^100%$/ }).count();
    if (progressValue > 0) {
      console.log('Progress reached 100%. Proceeding...');
    } else {
      console.log('Progress did not reach 100%.');
    }
    console.log('Process complete.');

    console.log('Saving...');
    await this.saveButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.waitForElementEnabled(this.saveButton, 20000);
    await this.saveButton.click();
    await this.page.waitForTimeout(7000); 
    await this.page.locator('.MuiPaper-root > div > .MuiGrid-root > div > .MuiButtonBase-root').click();
    await this.page.waitForTimeout(5000);
  }
  

  async test4() {
    console.log('Executing circuit actions...');
  
    // Create circuit
    await this.createCircuitButton.waitFor({ state: 'visible', timeout: 30000 }); // Increased timeout
    await this.waitForElementEnabled(this.createCircuitButton, 30000); // Increased timeout
    await this.createCircuitButton.click();
    await this.page.waitForTimeout(20000); // Kept the same
  
    console.log('Right-clicking on Segment row header...');
    await this.page.getByRole('rowheader', { name: 'Segment' }).click({ button: 'right' });
  
    console.log('Selecting "Add Splice" option...');
    await this.page.getByRole('menuitem', { name: 'Add Splice' }).click();
  
    console.log('Right-clicking on "0001"...');
    await this.page.getByText('0001', { exact: true }).click({ button: 'right' });
  
    console.log('Clicking on backdrop...');
    await this.page.locator('.MuiBackdrop-root').click();
  
    console.log('Clicking on "Design Active Circuit" button...');
    await this.page.getByLabel('Design Active Circuit').getByRole('button').click();
    await this.page.waitForTimeout(30000); // Increased timeout
  
    console.log('Clicking on "Save" button...');
    await this.page.getByLabel('Save').getByRole('button').click();
    await this.page.waitForTimeout(20000); // Kept the same
  }  

  async countAndSaveCircuits() {
    await this.createCircuitButton.waitFor({ state: 'visible', timeout: 30000 }); 
    await this.waitForElementEnabled(this.createCircuitButton, 30000); 
    await this.createCircuitButton.click();
    await this.page.waitForTimeout(20000);
    const circuitLocator = this.page.locator('[data-testid^="rf__node-"]');
    await circuitLocator.first().waitFor({ state: 'visible', timeout: 20000 });
    await circuitLocator.first().click(); 
    await this.page.waitForTimeout(20000);
    await this.DesignProjectButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.page.getByLabel('Design Active Circuit').getByRole('button').click();
    await this.DesignProjectButton.click();
    await this.page.waitForTimeout(20000);
    await this.page.getByRole('tab', { name: 'Design Results' }).first().click();
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('checkbox', { name: 'Override' }).first().check();
    const checkbox = this.page.getByRole('checkbox', { name: 'Override' }).first();
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.check();
    await this.page.getByText('ZP-XP').click();
    const dropdown = this.page.getByText('ZP-XPJB-K/XP Plus-SX-120-');
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    const optionsCount = await this.page.locator('role=option').count();
    console.log(`Número de opciones visibles: ${optionsCount}`);
    await this.page.keyboard.press('Escape');
    await this.page.getByLabel('Save').getByRole('button').click();
  }

  // para diseñar y validar imágenes
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
