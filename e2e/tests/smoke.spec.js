const { test, expect } = require('@playwright/test');

test.describe('Smoke Test - UI Rendering', () => {
  test('should render main UI elements', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Verify main heading is visible
    await expect(page.getByRole('heading', { name: 'Natural Language Security Control' })).toBeVisible();

    // Verify command input textarea is visible
    await expect(page.getByPlaceholder('Enter your command...')).toBeVisible();

    // Verify submit button is visible
    await expect(page.getByRole('button', { name: /execute command/i })).toBeVisible();

    // Verify example commands section is visible
    await expect(page.getByText(/example commands/i)).toBeVisible();

    // Verify at least one example command button is visible
    const exampleCommands = page.locator('.example-command-button');
    await expect(exampleCommands.first()).toBeVisible();
  });
});

