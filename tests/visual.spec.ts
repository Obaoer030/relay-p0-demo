import { expect, test } from '@playwright/test'

test('desktop demo stage is legible at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/demo')
  await page.getByRole('button', { name: '重置' }).click()
  await expect(page).toHaveScreenshot('demo-initial-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })

  await page.getByRole('button', { name: '已接住', exact: true }).click()
  await expect(page.getByLabel('责任状态：当前由小雨推进')).toHaveCount(2)
  await expect(page).toHaveScreenshot('demo-accepted-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})

test('standalone product views fit 375x812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page).toHaveScreenshot('owner-initial-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })

  await page.goto('/demo')
  await page.getByRole('button', { name: '已分享', exact: true }).click()
  await expect(page.getByLabel('责任状态：已发给小雨，等待她回应').last()).toBeVisible()
  await expect.poll(() => page.evaluate(() =>
    window.localStorage.getItem('relay:p0-demo-state'),
  )).toContain('"demoStage":"shared"')
  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('button', { name: '我愿意接住' })).toBeVisible()
  await expect(page).toHaveScreenshot('helper-shared-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})
