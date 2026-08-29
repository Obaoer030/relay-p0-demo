import { expect, test } from '@playwright/test'

test('required routes render without a runtime error', async ({ page }) => {
  for (const path of ['/', '/demo', '/r/demo-cat-checkup']) {
    await page.goto(path)
    await expect(page.locator('#root')).not.toBeEmpty()
  }
})
