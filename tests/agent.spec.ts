import { expect, test } from '@playwright/test'

test.beforeEach(async ({ request }) => {
  await request.delete('/api/workspace')
})

test('typed Agent asks for missing information and only publishes after confirmation', async ({ page, request }) => {
  const health = await request.get('/api/health')
  await expect(health).toBeOK()
  expect((await health.json() as { agent: string }).agent).toBe('local-demo')

  await page.goto('/matters/new')
  await expect(page.getByRole('heading', { name: '把一件事说出来，Relay 帮你安排清楚' })).toBeVisible()
  const initialCount = await page.evaluate(() => (JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{"matters":[]}') as { matters: unknown[] }).matters.length)

  await page.getByLabel('描述你想安排的事情').fill('我周五临时出差，想请小雨周六带布丁复诊。')
  await page.getByRole('button', { name: '发送给协作 Agent' }).click()
  await expect(page.getByText('复诊预约的具体时间是什么？')).toBeVisible()
  await expect(page.getByText('发布前还缺')).toBeVisible()
  expect(await page.evaluate(() => (JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{"matters":[]}') as { matters: unknown[] }).matters.length)).toBe(initialCount)

  await page.getByLabel('补充 Agent 询问的信息').fill('周六上午 9:30，在常去的宠物医院。')
  await page.getByRole('button', { name: '发送给协作 Agent' }).click()
  await expect(page.getByRole('button', { name: '确认并创建 3 个步骤' })).toBeEnabled()
  await expect(page.getByText('本地演示引擎').first()).toBeVisible()
  await page.getByRole('button', { name: '确认并创建 3 个步骤' }).click()

  await expect(page.getByText('RELAY COORDINATOR')).toBeVisible()
  await expect(page.getByText('Agent 计划第 1/3 步')).toBeVisible()
  expect(await page.evaluate(() => (JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{"matters":[]}') as { matters: unknown[] }).matters.length)).toBe(initialCount + 3)
})

test('isolated computer and phone contexts share one server room', async ({ browser, request }) => {
  await request.delete('/api/workspace')
  const computerContext = await browser.newContext()
  const phoneContext = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const computer = await computerContext.newPage()
  const phone = await phoneContext.newPage()
  try {
    await computer.goto('/matters/ws-cat-checkup')
    await expect(computer.getByText('正在等待对方确认是否负责')).toBeVisible()
    await phone.goto('/r/demo-cat-checkup')
    await phone.getByRole('button', { name: '可以，我来处理' }).click()
    await expect(computer.getByText('对方已经确认负责下一步')).toBeVisible({ timeout: 1_000 })
    await expect(computer.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible()
  } finally {
    await computerContext.close()
    await phoneContext.close()
  }
})
