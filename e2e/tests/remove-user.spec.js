const { test, expect } = require('@playwright/test');

test.describe('Remove User E2E', () => {
  test('should remove a user via natural language command after adding', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'");
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Step 1: Add a user first
    await commandInput.fill('add user Alice with pin 9876');
    await submitButton.click();

    // Wait for results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify the user was added
    const resultsDisplay = page.locator('.results-display');
    await expect(resultsDisplay).toBeVisible();

    const interpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const interpretationText = await interpretationSection.locator('pre').textContent();
    expect(interpretationText).toContain('ADD_USER');
    expect(interpretationText).toContain('Alice');

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();

    // Step 2: Remove the user
    await commandInput.clear();
    await commandInput.fill('remove user Alice');
    await submitButton.click();

    // Wait for new results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify the results display is visible
    await expect(resultsDisplay).toBeVisible();

    // Verify REMOVE_USER intent
    const newInterpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const newInterpretationText = await newInterpretationSection.locator('pre').textContent();
    expect(newInterpretationText).toContain('REMOVE_USER');
    expect(newInterpretationText).toContain('Alice');

    // Verify the Response section shows success
    const responseSection = resultsDisplay.locator('section').filter({ hasText: 'Response' });
    await expect(responseSection).toBeVisible();
    
    const responseText = await responseSection.locator('pre').textContent();
    expect(responseText).toMatch(/success|removed/i);

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();

    // Step 3: Verify user is no longer in the list
    await commandInput.clear();
    await commandInput.fill('show me all users');
    await submitButton.click();

    // Wait for new results to appear
    await expect(page.getByText('Interpretation')).toBeVisible({ timeout: 10000 });

    // Verify LIST_USERS intent
    const listInterpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
    const listInterpretationText = await listInterpretationSection.locator('pre').textContent();
    expect(listInterpretationText).toContain('LIST_USERS');

    // Verify Alice is NOT in the response
    const listResponseSection = resultsDisplay.locator('section').filter({ hasText: 'Response' });
    await expect(listResponseSection).toBeVisible();
    
    const listResponseText = await listResponseSection.locator('pre').textContent();
    expect(listResponseText).not.toContain('Alice');

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();
  });
});

