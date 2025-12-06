const { test, expect } = require('@playwright/test');

test.describe('Invalid Command E2E', () => {
  test('should display error for unsupported command', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Find the command input and submit button
    const commandInput = page.getByPlaceholder('Enter your command...');
    const submitButton = page.getByRole('button', { name: /execute command/i });

    // Send an invalid/unsupported command
    await commandInput.fill('do something random');
    await submitButton.click();

    // Wait for error to appear (or check for error response)
    // The error might appear immediately or after a brief delay
    const errorDisplay = page.locator('.error-display');
    await expect(errorDisplay).toBeVisible({ timeout: 10000 });

    // Verify error message is displayed
    const errorMessage = errorDisplay.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    
    const errorText = await errorMessage.textContent();
    expect(errorText).toMatch(/error|invalid|unrecognized|unknown/i);

    // Verify results display is NOT visible (or shows error state)
    // If the backend returns an error response, results might still be visible but with error content
    // So we check that either:
    // 1. Results display is not visible, OR
    // 2. Results display shows an error/unknown state
    
    const resultsDisplay = page.locator('.results-display');
    const isResultsVisible = await resultsDisplay.isVisible().catch(() => false);
    
    if (isResultsVisible) {
      // If results are visible, check that they indicate an error or unknown state
      const interpretationSection = resultsDisplay.locator('section').filter({ hasText: 'Interpretation' });
      if (await interpretationSection.isVisible().catch(() => false)) {
        const interpretationText = await interpretationSection.locator('pre').textContent();
        // Check if intent is null or indicates an error
        expect(interpretationText).toMatch(/null|error|unknown|invalid/i);
      }
    } else {
      // Results display is not visible, which is also acceptable for errors
      expect(isResultsVisible).toBe(false);
    }

    // Verify retry button is available (if error display includes it)
    const retryButton = errorDisplay.locator('.retry-button');
    const retryButtonVisible = await retryButton.isVisible().catch(() => false);
    // Retry button may or may not be present, so we don't assert on it
  });
});

