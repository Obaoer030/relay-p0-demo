import { expect, test } from '@playwright/test'
import { installAgentFixture } from './agentFixture.ts'

test.beforeEach(async ({ page, request }) => {
  await request.delete('/api/workspace')
  await installAgentFixture(page)
  await page.clock.setFixedTime(new Date('2026-08-29T08:00:00.000Z'))
})

test('complete demo entry is legible at 1440x900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/demo')
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page).toHaveScreenshot('complete-demo-entry-1440x900.png', {
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
  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
  await expect(page.getByRole('heading', { name: '早上好，小雨' })).toBeVisible()
  await expect(page).toHaveScreenshot('workspace-xiaoyu-overview-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')
  await page.goto('/matters')
  await expect(page).toHaveScreenshot('workspace-matters-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.goto('/matters/new')
  await expect(page).toHaveScreenshot('workspace-agent-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.getByLabel('描述你想安排的事情').fill('请小雨周六上午 9:30 带布丁复诊。')
  await page.getByLabel('描述你想安排的事情').press('Enter')
  await expect(page.getByRole('button', { name: '确认并创建 3 个步骤' })).toBeEnabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await expect(page).toHaveScreenshot('workspace-agent-conversation-1440x900.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})

test('overview keeps an intentional headline hierarchy at intermediate desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 })
  await page.goto('/')
  await expect(page.locator('.relay-command-headline')).toContainText('下一步交给对的人')
  await expect(page).toHaveScreenshot('workspace-overview-900x900.png', {
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
  await page.locator('.workspace-mobile-header').getByLabel('切换用户视角').selectOption('xiaoyu')
  await expect(page.getByRole('heading', { name: '早上好，小雨' })).toBeVisible()
  await expect(page).toHaveScreenshot('workspace-xiaoyu-overview-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.locator('.workspace-mobile-header').getByLabel('切换用户视角').selectOption('linran')
  await page.goto('/matters')
  await expect(page).toHaveScreenshot('workspace-matters-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })

  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('button', { name: '可以，我来处理' })).toBeVisible()
  await expect(page).toHaveScreenshot('helper-shared-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.goto('/matters/new')
  await expect(page).toHaveScreenshot('workspace-agent-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
  await page.getByLabel('描述你想安排的事情').fill('请小雨周六上午 9:30 带布丁复诊。')
  await page.getByLabel('描述你想安排的事情').press('Enter')
  await expect(page.getByRole('button', { name: '确认并创建 3 个步骤' })).toBeEnabled()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await expect(page).toHaveScreenshot('workspace-agent-conversation-375x812.png', {
    animations: 'disabled',
    caret: 'hide',
  })
})
