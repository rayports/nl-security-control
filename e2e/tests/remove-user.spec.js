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

    // Wait for command to appear in history
    const addHistoryItem = page.getByTestId('history-item-0');
    await expect(addHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(addHistoryItem.getByText('add user Alice with pin 9876')).toBeVisible();
    await expect(addHistoryItem.getByText('✓')).toBeVisible();

    // Verify no error is displayed
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).not.toBeVisible();

    // Step 2: Remove the user
    await commandInput.fill('remove user Alice');
    await submitButton.click();

    // Wait for remove command to appear in history
    const removeHistoryItem = page.getByTestId('history-item-0');
    await expect(removeHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(removeHistoryItem.getByText('remove user Alice')).toBeVisible();
    await expect(removeHistoryItem.getByText('✓')).toBeVisible();

    // Click on history item to see details
    await removeHistoryItem.click();

    // Wait for detail view to appear
    await expect(page.getByText('Command Details')).toBeVisible();

    // Verify REMOVE_USER intent
    await expect(page.getByText('Interpretation')).toBeVisible();
    // Find the Interpretation section and get its pre tag
    const interpretationSection = page.locator('.detail-section').filter({ hasText: 'Interpretation' });
    const interpretationPre = interpretationSection.locator('pre');
    await expect(interpretationPre).toBeVisible();
    const interpretationText = await interpretationPre.textContent();
    expect(interpretationText).toContain('REMOVE_USER');

    // Verify the Response section shows success
    await expect(page.getByText('Response')).toBeVisible();
    // Find the Response section and get its pre tag
    const responseSection = page.locator('.detail-section').filter({ hasText: 'Response' });
    const responsePre = responseSection.locator('pre');
    await expect(responsePre).toBeVisible();
    const responseText = await responsePre.textContent();
    expect(responseText).toMatch(/success|removed/i);

    // Close detail view
    await page.getByRole('button', { name: /close/i }).click();

    // Step 3: Verify user is no longer in the list
    await commandInput.fill('show me all users');
    await submitButton.click();

    // Wait for list command to appear in history
    const listHistoryItem = page.getByTestId('history-item-0');
    await expect(listHistoryItem).toBeVisible({ timeout: 10000 });
    await expect(listHistoryItem.getByText('show me all users')).toBeVisible();

    // Click on history item to see details
    await listHistoryItem.click();

    // Wait for detail view to appear
    await expect(page.getByText('Command Details')).toBeVisible();

    // Verify LIST_USERS intent
    await expect(page.getByText('Interpretation')).toBeVisible();
    // Find the Interpretation section and get its pre tag
    const listInterpretationSection = page.locator('.detail-section').filter({ hasText: 'Interpretation' });
    const listInterpretationPre = listInterpretationSection.locator('pre');
    await expect(listInterpretationPre).toBeVisible();
    const listInterpretationText = await listInterpretationPre.textContent();
    expect(listInterpretationText).toContain('LIST_USERS');

    // Verify Alice is NOT in the response
    await expect(page.getByText('Response')).toBeVisible();
    // Find the Response section and get its pre tag
    const listResponseSection = page.locator('.detail-section').filter({ hasText: 'Response' });
    const listResponsePre = listResponseSection.locator('pre');
    await expect(listResponsePre).toBeVisible();
    const listResponseText = await listResponsePre.textContent();
    expect(listResponseText).not.toContain('Alice');

    // Verify no error is displayed
    await expect(errorDisplay).not.toBeVisible();
  });
});

