const { test, expect } = require('@playwright/test');

test.describe('Arm System E2E', () => {
  test('should arm the system via natural language command', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'");
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Type the command to arm the system
    await commandInput.fill('arm the system to away mode');
    await submitButton.click();

    // Wait for command to appear in history
    const historyItem = page.getByTestId('history-item-0');
    await expect(historyItem).toBeVisible({ timeout: 10000 });
    await expect(historyItem.getByText('arm the system to away mode')).toBeVisible();
    
    // Verify success indicator
    await expect(historyItem.getByText('✓')).toBeVisible();

    // Click on history item to see details
    await historyItem.click();

    // Wait for detail view to appear
    await expect(page.getByText('Command Details')).toBeVisible();
    
    // Verify the Interpretation section contains ARM_SYSTEM intent
    await expect(page.getByText('Interpretation')).toBeVisible();
    const interpretationText = await page.locator('.history-detail-content').getByText(/ARM_SYSTEM/i).textContent();
    expect(interpretationText).toContain('ARM_SYSTEM');

    // Verify the Response section shows success
    await expect(page.getByText('Response')).toBeVisible();
    const responseText = await page.locator('.history-detail-content').getByText(/armed|success/i).textContent();
    expect(responseText).toMatch(/armed|success/i);

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();
  });
});

