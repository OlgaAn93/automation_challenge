import { test, expect } from '@playwright/test';

test('Copy and Paste translation from English to Danish', async ({ page }) => {
  // Navigate to the translator
  await page.goto('/products/languagewire-translate');
  await page.getByRole('button', { name: 'Accept cookies' }).click();
  await page.locator('#lwt-widget').waitFor({ state: 'visible' });
  const frame = page.frameLocator('#lwt-widget');
  
  // Setting source and target languages
  const languageDropdownButtons = frame.locator('[data-cy="language-menu-dropdown-button"]');
  await frame.locator('[data-cy="language-menu-dropdown-button"]').first().waitFor({ state: 'visible' });
  await languageDropdownButtons.nth(0).click();
  await frame.getByRole('menuitem', { name: 'English' }).click();
  await languageDropdownButtons.nth(1).click();
  await frame.getByRole('menuitem', { name: 'Danish' }).click();

  // Filling input text
  await expect(frame.getByRole('textbox', { name: 'Type your text' })).toBeVisible();
  const inputBox = frame.getByRole('textbox', { name: 'Type your text' });
  const inputText = 'Playwright is a powerful, open-source Playwright testing tool that provides reliable cross-browser and cross-platform testing capabilities. It supports multiple modern web browsers like Chromium, Firefox, and WebKit, making it ideal for end-to-end testing in different environments. Its ability to work in different environments makes it a preferred tool for Automation Testing Companies.';
  await inputBox.fill(inputText);

  // Validating output text
  const outputBox = frame.locator('lw-output-text');
  await expect(outputBox.getByText('Playwright er et kraftfuldt, open source Playwright-testværktøj, der giver pålidelige testfunktioner på tværs af browsere og platforme. Den understøtter flere moderne webbrowsere som Chromium, Firefox og WebKit, hvilket gør den ideel til end-to-end-test i forskellige miljøer. Dens evne til at arbejde i forskellige miljøer gør den til et foretrukket værktøj for automatiseringstestvirksomheder.')).toBeVisible();
  await expect(outputBox).toContainText('automatiseringstestvirksomheder');
  await frame.getByText('Dens evne til at arbejde i').click();
  await expect(
    frame.getByRole('menuitemradio', { name: /Original/ })
  ).toBeVisible({ timeout: 10000 });

  // Select all text and copy it
  await inputBox.click();
  await page.keyboard.down(process.platform === 'darwin' ? 'Meta' : 'Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.press('KeyC');
  await page.keyboard.up(process.platform === 'darwin' ? 'Meta' : 'Control');

  // Clear input
  await inputBox.fill(''); 
  await inputBox.click();

  //Paste text
  await page.keyboard.down(process.platform === 'darwin' ? 'Meta' : 'Control');
  await page.keyboard.press('KeyV');
  await page.keyboard.up(process.platform === 'darwin' ? 'Meta' : 'Control');

  // Wait for translation to appear in Danish
  await expect(outputBox).toBeVisible({ timeout: 10000 });

  // Check a Danish keyword is included (partial match)
  await expect(outputBox).toContainText('automatiseringstestvirksomheder'); 
  
});