import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-08-29T08:00:00.000Z'))
})

test('desktop demo stage is legible at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/demo')
  await page.getByRole('button', { name: '重置' }).click()
  await expect(page).toHaveScreenshot('demo-initial-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })

  await page.getByRole('button', { name: '已确认', exact: true }).click()
  await expect(page.getByLabel('负责人状态：这一步由小雨负责')).toHaveCount(2)
  await expect(page).toHaveScreenshot('demo-accepted-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})

test('complete workspace is visible at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page).toHaveScreenshot('workspace-overview-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.goto('/matters')
  await expect(page).toHaveScreenshot('workspace-matters-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})

test('complete workspace fits 375x812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page).toHaveScreenshot('workspace-overview-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.goto('/matters')
  await expect(page).toHaveScreenshot('workspace-matters-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })

  await page.goto('/demo')
  await page.getByRole('button', { name: '已邀请', exact: true }).click()
  await expect.poll(() => page.evaluate(() =>
    window.localStorage.getItem('relay:p0-demo-state'),
  )).toContain('"demoStage":"shared"')
  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('button', { name: '可以，我来处理' })).toBeVisible()
  await expect(page).toHaveScreenshot('helper-shared-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})
