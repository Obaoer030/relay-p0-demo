import { expect, test } from '@playwright/test'
import { installAgentFixture } from './agentFixture.ts'

test.beforeEach(async ({ page, request }) => {
  await request.delete('/api/workspace')
  await installAgentFixture(page)
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('relay:test-initialized')) {
      localStorage.clear()
      sessionStorage.setItem('relay:test-initialized', '1')
    }
  })
})

test('required routes use the complete workspace and invalid tokens disclose nothing', async ({ page }) => {
  await page.goto('/demo')
  await expect(page).toHaveURL(/\/\?demo=complete$/)
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByText('演示阶段')).toHaveCount(0)
  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('heading', { name: '周六带布丁完成复诊' })).toBeVisible()
  await page.goto('/r/not-a-real-token')
  await expect(page.getByRole('heading', { name: '这个协作链接不可用' })).toBeVisible()
  await expect(page.getByText('周六带布丁完成复诊')).toHaveCount(0)
})

test('same-origin helper acceptance reaches the full owner workspace within 500ms', async ({ context }) => {
  const owner = await context.newPage()
  const helper = await context.newPage()
  await owner.goto('/matters/ws-cat-checkup')
  await expect(owner.getByText('正在等待对方确认是否负责')).toBeVisible()
  await helper.goto('/r/demo-cat-checkup')
  const started = Date.now()
  await helper.getByRole('button', { name: '可以，我来处理' }).click()
  await expect(owner.getByText('对方已经确认负责下一步')).toBeVisible({ timeout: 500 })
  expect(Date.now() - started).toBeLessThan(500)
  await expect(owner.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible()
})

test('adjustment, reconfirmation, completion result, and reopen form one legal lifecycle', async ({ context }) => {
  const owner = await context.newPage()
  const helper = await context.newPage()
  await owner.goto('/matters/ws-cat-checkup')
  await helper.goto('/r/demo-cat-checkup')
  await helper.getByRole('button', { name: '需要先调整约定' }).click()
  await helper.getByLabel('需要调整什么？').fill('请把接猫时间改到 10:00 以后')
  await helper.getByRole('button', { name: '发送建议' }).click()
  await expect(owner.getByText('请把接猫时间改到 10:00 以后')).toBeVisible({ timeout: 500 })
  await owner.getByRole('link', { name: '编辑' }).click()
  await owner.getByLabel('明确的下一步 *').fill('10:20 接到布丁，11:00 前到达诊所')
  await owner.getByRole('button', { name: '保存事项' }).click()
  await expect(helper.getByRole('button', { name: '可以，我来处理' })).toBeVisible({ timeout: 500 })
  await helper.getByRole('button', { name: '可以，我来处理' }).click()
  await helper.getByLabel('完成结果').fill('布丁已回家，复诊结论已发给林然')
  await helper.getByRole('button', { name: '确认完成并同步结果' }).click()
  await expect(owner.getByText('布丁已回家，复诊结论已发给林然').first()).toBeVisible({ timeout: 500 })
  await owner.getByRole('button', { name: '重新打开事项' }).click()
  await expect(owner.getByText('下一步由我处理')).toBeVisible()
})

test('desktop keeps the system cursor and adds a visible pointer locator', async ({ page }) => {
  await page.goto('/')
  await page.mouse.move(420, 260)
  await expect(page.locator('.relay-signal-cursor')).toBeVisible()
  await expect(page.locator('.relay-signal-cursor')).toContainText('指针')
  expect(await page.locator('body').evaluate((node) => getComputedStyle(node).cursor)).not.toBe('none')
  expect(await page.evaluate(() => ({ x: document.documentElement.style.getPropertyValue('--signal-x'), y: document.documentElement.style.getPropertyValue('--signal-y') }))).toEqual({ x: '420px', y: '260px' })
})

test('reduced motion and mobile layouts retain meaning without overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.relay-signal-cursor')).toBeHidden()
  await expect(page.locator('.workspace-route-scan')).toHaveCSS('animation-name', 'none')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('button', { name: '可以，我来处理' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  const primary = await page.getByRole('button', { name: '可以，我来处理' }).boundingBox()
  expect(primary?.height).toBeGreaterThanOrEqual(44)
})

test('LAN HTTP browsers work when crypto.randomUUID is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', { value: undefined, configurable: true })
  })
  await page.goto('/matters/new')
  await expect(page.getByRole('heading', { name: '把一件事说出来，Relay 帮你安排清楚' })).toBeVisible()
  await expect(page.getByText('演示房间在线')).toBeVisible()
  await page.getByLabel('描述你想安排的事情').fill('请小雨周六上午 9:30 带布丁复诊。')
  await page.getByRole('button', { name: '发送给协作 Agent' }).click()
  await expect(page.getByRole('button', { name: '确认并创建 3 个步骤' })).toBeEnabled()
  await page.getByRole('button', { name: '确认并创建 3 个步骤' }).click()
  await expect(page.getByText('Agent 计划第 1/3 步')).toBeVisible()
})
