const { test, expect } = require('@playwright/test');

test.describe('Command History', () => {
  test('should display command in history after successful execution', async ({ page }) => {
    await page.goto('/');

    // Execute a command
    const textarea = page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'");
    await textarea.fill('arm the system');
    await page.getByRole('button', { name: /execute command/i }).click();

    // Wait for command to appear in history
    await expect(page.getByText(/command history/i)).toBeVisible({ timeout: 10000 });

    // Verify the command appears in history
    const historyItem = page.getByTestId('history-item-0');
    await expect(historyItem).toBeVisible();
    await expect(historyItem.getByText('arm the system')).toBeVisible();
    
    // Verify success indicator
    await expect(historyItem.getByText('✓')).toBeVisible();
  });

  test('should display failed command in history', async ({ page }) => {
    await page.goto('/');

    // Execute an invalid command
    const textarea = page.getByPlaceholder(/try:.*arm the system/i);
    await textarea.fill('invalid command that will fail');
    await page.getByRole('button', { name: /execute command/i }).click();

    // Wait for error to appear
    await expect(page.getByText(/error/i)).toBeVisible({ timeout: 10000 });

    // Verify command history section appears
    await expect(page.getByText(/command history/i)).toBeVisible();

    // Verify the failed command appears in history
    const historyItem = page.getByTestId('history-item-0');
    await expect(historyItem).toBeVisible();
    await expect(historyItem.getByText('invalid command that will fail')).toBeVisible();
    
    // Verify error indicator
    await expect(historyItem.getByText('✗')).toBeVisible();
  });

  test('should show detailed view when clicking history item', async ({ page }) => {
    await page.goto('/');

    // First, execute a command to create history
    const textarea = page.getByPlaceholder(/try:.*arm the system/i);
    await textarea.fill('arm the system');
    await page.getByRole('button', { name: /execute command/i }).click();

    // Wait for command to complete and history to appear
    await expect(page.getByText(/command history/i)).toBeVisible({ timeout: 10000 });

    // Clear the textarea
    await textarea.clear();

    // Click on the history item
    const historyItem = page.getByTestId('history-item-0');
    await historyItem.click();

    // Verify detailed view is shown
    await expect(page.getByText('Command Details')).toBeVisible();
    await expect(page.getByText('Original Command')).toBeVisible();
    
    // Scope query to detail modal to avoid matching history item
    const detailModal = page.locator('.history-detail-modal');
    await expect(detailModal.getByText('arm the system')).toBeVisible();

    // Verify command is NOT populated in textarea
    await expect(textarea).toHaveValue('');
  });

  test('should persist history across page reloads', async ({ page }) => {
    await page.goto('/');

    // Execute a command
    const textarea = page.getByPlaceholder("Try: 'arm the system' or 'add user John with pin 4321'");
    await textarea.fill('disarm the system');
    await page.getByRole('button', { name: /execute command/i }).click();

    // Wait for command to complete
    await expect(page.getByText(/command history/i)).toBeVisible({ timeout: 10000 });

    // Reload the page
    await page.reload();

    // Verify history is still visible after reload
    await expect(page.getByText(/command history/i)).toBeVisible();
    
    // Verify command appears in history (scope to history container to avoid matching example button)
    const historyContainer = page.getByTestId('command-history');
    await expect(historyContainer.getByText('disarm the system')).toBeVisible();
  });
});

