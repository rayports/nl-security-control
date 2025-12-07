const { test, expect } = require('@playwright/test');

test.describe('Disarm System E2E', () => {
  test('should disarm the system via natural language command after arming', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'");
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Step 1: Arm the system first
    await commandInput.fill('arm the system');
    await submitButton.click();

    // Wait for command to appear in history
    const armHistoryItem = page.getByTestId('history-item-0');
    await expect(armHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(armHistoryItem.getByText('arm the system')).toBeVisible();
    await expect(armHistoryItem.getByText('✓')).toBeVisible();

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();

    // Step 2: Disarm the system
    await commandInput.fill('disarm the system');
    await submitButton.click();

    // Wait for disarm command to appear in history
    const disarmHistoryItem = page.getByTestId('history-item-0');
    await expect(disarmHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(disarmHistoryItem.getByText('disarm the system')).toBeVisible();
    await expect(disarmHistoryItem.getByText('✓')).toBeVisible();

    // Click on history item to see details
    await disarmHistoryItem.click();

    // Wait for detail view to appear
    await expect(page.getByText('Command Details')).toBeVisible();

    // Verify DISARM_SYSTEM intent
    await expect(page.getByText('Interpretation')).toBeVisible();
    const interpretationText = await page.locator('.history-detail-content').getByText(/DISARM_SYSTEM/i).textContent();
    expect(interpretationText).toContain('DISARM_SYSTEM');

    // Verify the Response section shows disarmed state
    await expect(page.getByText('Response')).toBeVisible();
    const responseText = await page.locator('.history-detail-content').getByText(/disarmed|armed.*false|success/i).textContent();
    expect(responseText).toMatch(/disarmed|armed.*false|success/i);

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();
  });
});

