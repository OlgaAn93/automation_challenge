import { test, expect } from '@playwright/test';

test('Check language swap', async ({ page }) => {
  // Navigate to the translator 
  await page.goto('/products/languagewire-translate');
  await page.getByRole('button', { name: 'Accept cookies' }).click();
  await page.locator('#lwt-widget').waitFor({ state: 'visible' });
  const frame = page.frameLocator('#lwt-widget');

  // Setting source and target languages
  const languageDropdownButtons = frame.locator('[data-cy="language-menu-dropdown-button"]');
  await frame.locator('[data-cy="language-menu-dropdown-button"]').first().waitFor({ state: 'visible' });
  await languageDropdownButtons.nth(0).click();
  await frame.getByRole('menuitem', { name: 'French' }).click();
  await languageDropdownButtons.nth(1).click();
  await frame.getByRole('menuitem', { name: 'Spanish' }).click();
  await expect(frame.getByRole('textbox', { name: 'Type your text' })).toBeVisible();

  // Filling the translation input
  await frame.getByRole('textbox', { name: 'Type your text' }).click();
  await frame.getByRole('textbox', { name: 'Type your text' }).fill('Oui');
  await expect(frame.getByText('Sí')).toBeVisible();

  // Swapping languages
  await frame.locator('.lw-language-select-bar__swap-button').click();
  await expect(frame.getByText('Oui')).toBeVisible({ timeout: 5000 });

  // Refresh page and check that chosen languages are still set as before
  await page.reload();
  await page.locator('#lwt-widget').waitFor({ state: 'attached' });

  await expect(
    frame.locator('[data-cy="language-button"].lw-language-select__button--selected', { hasText: 'Spanish' })
  ).toBeVisible();

  await expect(
    frame.locator('[data-cy="language-button"].lw-language-select__button--selected', { hasText: 'French' })
  ).toBeVisible();
  
  // Validating translation in languages set before page reload
  await expect(frame.getByRole('textbox', { name: 'Type your text' })).toBeVisible();
  await frame.getByRole('textbox', { name: 'Type your text' }).click();
  await frame.getByRole('textbox', { name: 'Type your text' }).fill('Hola');
  await expect(frame.getByText('Bonjour')).toBeVisible();
 
  
});