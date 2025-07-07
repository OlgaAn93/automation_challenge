import { test, expect } from '@playwright/test';
import path from 'path';

test('Translate file in Word format from English to Danish', async ({page}) => {
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

    // Validating elements related to file uplaoding
    await expect(frame.getByText('Select or drop a document')).toBeVisible();
    await expect(frame.getByText('Supported formats: .docx, .pptx')).toBeVisible();
    await expect(frame.getByRole('button', { name: 'Browse file' })).toBeVisible();

    // Resolve the full file path
    const filePath = path.resolve('./doc_upload/sample1.docx');

    // Upload the file by targeting the hidden input[type="file"]
    await frame.locator('input[type="file"]').waitFor({ state: 'attached', timeout: 10000 });
    await frame.locator('input[type="file"]').setInputFiles(filePath);

    // Validate that after uploading a file related elements are shown
    await expect(frame.getByRole('button', { name: 'Translate to Danish' })).toBeVisible();
    await expect(frame.locator('[data-cy="target-language-chip"]').getByText('Danish')).toBeVisible();

    //Start the translation of uplaoded document
    await frame.getByRole('button', { name: 'Translate to Danish' }).click();

    // Validating that translation is in progress and after finishing related message disappears
    const prepMessage = frame.getByText('Uploading the document.');
    await prepMessage.waitFor({ state: 'attached', timeout: 30000 });
    await expect(prepMessage).toBeVisible({ timeout: 10000 });
    await expect(prepMessage).toBeHidden({ timeout: 20000 });

    // Download is successful by created path
    const downloadPromise = page.waitForEvent('download');
    const downloadButton = frame.locator('[data-cy="download-translated-document-button"]');
    await downloadButton.click();
    const download = await downloadPromise;
    const filePathDownload = await download.path();
    console.log('Downloaded file path:', filePathDownload);

    //Assert the file path exists
    expect(filePathDownload).not.toBeNull();
});