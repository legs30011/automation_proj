import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { ProjectPage } from '../pages/projectPage';
import { LoginPage } from '../pages/loginPage';
import { generateRandomName, generateRandomProjectNumber } from '../utils/helpers';
import dotenv from 'dotenv';

dotenv.config();

test('Display Overwrites on Design', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const projectPage = new ProjectPage(page);

  const email = process.env.USER!;
  const password = process.env.PASSWORD!;

  // Generate random project details
  const projectName = generateRandomName();
  const projectNumber = generateRandomProjectNumber();
  const projectDate = '02/28/2025';

  // **Step 1: Navigate and login**
  await loginPage.navigate();
  await loginPage.login(email, password);

  // **Step 2: Navigate to dashboard and create project**
  await dashboardPage.navigateToDashboard();
  await dashboardPage.createProject();

  // **Step 3: Fill project details**
  await projectPage.fillProjectDetails(projectName, projectNumber.toString(), projectDate);

  // **Step 4: Complete project creation**
  await projectPage.completeProjectCreation();

  // **Step 5: Create circuit and design**
  await dashboardPage.DesignProject();
  await dashboardPage.navigateToDashboard();
  await dashboardPage.openProjectsInCache(projectName);
  await dashboardPage.selectProjectFromList(projectName);

  // **Step 6: Open the project**
  await projectPage.openProject(projectName);
  await page.waitForTimeout(4000);

  // **Step 7: Validate images and active circuit design**
  await dashboardPage.designActiveCircuitAndValidateImages();
});
