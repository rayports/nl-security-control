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

    // Wait for results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify the system was armed
    const resultsDisplay = page.locator('.results-display');
    await expect(resultsDisplay).toBeVisible();

    const interpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const interpretationText = await interpretationSection.locator('pre').textContent();
    expect(interpretationText).toContain('ARM_SYSTEM');

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();

    // Step 2: Disarm the system
    await commandInput.clear();
    await commandInput.fill('disarm the system');
    await submitButton.click();

    // Wait for new results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify the results display is visible
    await expect(resultsDisplay).toBeVisible();

    // Verify DISARM_SYSTEM intent
    const newInterpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const newInterpretationText = await newInterpretationSection.locator('pre').textContent();
    expect(newInterpretationText).toContain('DISARM_SYSTEM');
    expect(newInterpretationText).toContain('"intent"');

    // Verify the Response section shows disarmed state
    const responseSection = resultsDisplay.locator('section').filter({ hasText: 'Response' });
    await expect(responseSection).toBeVisible();
    
    const responseText = await responseSection.locator('pre').textContent();
    expect(responseText).toMatch(/disarmed|armed.*false|success/i);

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();
  });
});

