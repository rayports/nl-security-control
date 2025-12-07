const { test, expect } = require('@playwright/test');

test.describe('Add User and List Users E2E', () => {
  test('should add a user and then list users with masked PIN', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'");
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Step 1: Add a user
    await commandInput.fill('add user John with pin 4321');
    await submitButton.click();

    // Wait for command to appear in history
    const addHistoryItem = page.getByTestId('history-item-0');
    await expect(addHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(addHistoryItem.getByText('add user John with pin 4321')).toBeVisible();
    await expect(addHistoryItem.getByText('✓')).toBeVisible();

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();

    // Step 2: List users
    await commandInput.fill('show me all users');
    await submitButton.click();

    // Wait for list command to appear in history
    const listHistoryItem = page.getByTestId('history-item-0');
    await expect(listHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(listHistoryItem.getByText('show me all users')).toBeVisible();
    await expect(listHistoryItem.getByText('✓')).toBeVisible();

    // Click on history item to see details
    await listHistoryItem.click();

    // Wait for detail view to appear
    await expect(page.getByText('Command Details')).toBeVisible();

    // Verify LIST_USERS intent
    await expect(page.getByText('Interpretation')).toBeVisible();
    // Find the Interpretation section and get its pre tag
    const interpretationSection = page.locator('.detail-section').filter({ hasText: 'Interpretation' });
    const interpretationPre = interpretationSection.locator('pre');
    await expect(interpretationPre).toBeVisible();
    const interpretationText = await interpretationPre.textContent();
    expect(interpretationText).toContain('LIST_USERS');

    // Verify the response contains "John"
    await expect(page.getByText('Response')).toBeVisible();
    // Find the Response section and get its pre tag
    const responseSection = page.locator('.detail-section').filter({ hasText: 'Response' });
    const responsePre = responseSection.locator('pre');
    await expect(responsePre).toBeVisible();
    const responseText = await responsePre.textContent();
    expect(responseText).toContain('John');

    // Verify the PIN is masked (should contain ****21 or similar pattern)
    // The backend masks PINs as ****XX where XX are the last two digits
    expect(responseText).toMatch(/\*\*\*\*21|\*\*\*\*\d{2}/);

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();
  });
});

