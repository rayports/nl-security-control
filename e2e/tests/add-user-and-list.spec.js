const { test, expect } = require('@playwright/test');

test.describe('Add User and List Users E2E', () => {
  test('should add a user and then list users with masked PIN', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder('Enter your command...');
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Step 1: Add a user
    await commandInput.fill('add user John with pin 4321');
    await submitButton.click();

    // Wait for results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify success - check for ADD_USER intent
    const resultsDisplay = page.locator('.results-display');
    await expect(resultsDisplay).toBeVisible();

    const interpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const interpretationText = await interpretationSection.locator('pre').textContent();
    expect(interpretationText).toContain('ADD_USER');
    expect(interpretationText).toContain('John');

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();

    // Step 2: Clear the input and list users
    await commandInput.clear();
    await commandInput.fill('show me all users');
    await submitButton.click();

    // Wait for new results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify the results display is visible
    await expect(resultsDisplay).toBeVisible();

    // Verify LIST_USERS intent
    const newInterpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const newInterpretationText = await newInterpretationSection.locator('pre').textContent();
    expect(newInterpretationText).toContain('LIST_USERS');

    // Verify the response contains "John"
    const responseSection = resultsDisplay.locator('section').filter({ hasText: 'Response' });
    await expect(responseSection).toBeVisible();
    
    const responseText = await responseSection.locator('pre').textContent();
    expect(responseText).toContain('John');

    // Verify the PIN is masked (should contain ****21 or similar pattern)
    // The backend masks PINs as ****XX where XX are the last two digits
    expect(responseText).toMatch(/\*\*\*\*21|\*\*\*\*\d{2}/);

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();
  });
});

