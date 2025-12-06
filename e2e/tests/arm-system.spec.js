const { test, expect } = require('@playwright/test');

test.describe('Arm System E2E', () => {
  test('should arm the system via natural language command', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder('Enter your command...');
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Type the command to arm the system
    await commandInput.fill('arm the system to away mode');
    await submitButton.click();

    // Wait for results to appear (wait for the Interpretation section)
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify the results display is visible
    const resultsDisplay = page.locator('.results-display');
    await expect(resultsDisplay).toBeVisible();

    // Verify the Interpretation section contains ARM_SYSTEM intent
    const interpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    await expect(interpretationSection).toBeVisible();
    
    // Check that the interpretation JSON contains ARM_SYSTEM
    const interpretationText = await interpretationSection.locator('pre').textContent();
    expect(interpretationText).toContain('ARM_SYSTEM');
    expect(interpretationText).toContain('"intent"');

    // Verify the Response section shows success
    const responseSection = resultsDisplay.locator('section').filter({ hasText: 'Response' });
    await expect(responseSection).toBeVisible();
    
    // Check that the response contains "armed" or success indication
    const responseText = await responseSection.locator('pre').textContent();
    expect(responseText).toMatch(/armed|success/i);

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();
  });
});

