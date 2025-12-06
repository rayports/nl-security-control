const { test, expect } = require('@playwright/test');

test.describe('Smoke Test - UI Rendering', () => {
  test('should render main UI elements', async ({ page }) => {
    // Navigate to the app root
    await page.goto('/');

    // Verify main heading is visible
    await expect(page.getByRole('heading', { name: 'Natural Language Security Control' })).toBeVisible();

    // Verify command input textarea is visible with placeholder
    await expect(page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'")).toBeVisible();

    // Verify submit button is visible
    await expect(page.getByRole('button', { name: /execute command/i })).toBeVisible();

    // Verify hint text is visible
    await expect(page.getByText(/you can arm\/disarm the system/i)).toBeVisible();

    // Verify example commands section is NOT visible
    await expect(page.getByText(/example commands/i)).not.toBeVisible();
  });
});

