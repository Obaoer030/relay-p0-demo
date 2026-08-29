import { expect, test } from '@playwright/test'
import { installAgentFixture } from './agentFixture.ts'

test.beforeEach(async ({ page, request }) => {
  await request.delete('/api/workspace')
  await installAgentFixture(page)
})

test('typed Agent asks for missing information and only publishes after confirmation', async ({ page, request }) => {
  const health = await request.get('/api/health')
  await expect(health).toBeOK()
  expect((await health.json() as { agent: string }).agent).toBe('unconfigured')

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
  await expect(page.getByText('MiniMax 在线').first()).toBeVisible()
  await page.getByRole('button', { name: '确认并创建 3 个步骤' }).click()

  await expect(page.getByText('RELAY COORDINATOR')).toBeVisible()
  await expect(page.getByText('Agent 计划第 1/3 步')).toBeVisible()
  expect(await page.evaluate(() => (JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{"matters":[]}') as { matters: unknown[] }).matters.length)).toBe(initialCount + 3)
})

test('complex request becomes seven independently confirmable checkpoints', async ({ page }) => {
  await page.goto('/matters/new')
  await page.getByLabel('描述你想安排的事情').fill('下周三上午9点请小雨陪妈妈去医院复诊。先准备医保卡和检查报告，看完病后取药，拿完药后买血糖检测工具，回家整理好，再把结果发给我。')
  await page.getByRole('button', { name: '发送给协作 Agent' }).click()
  await expect(page.getByRole('button', { name: '确认并创建 7 个步骤' })).toBeEnabled()
  for (const title of ['准备就医材料', '完成医院挂号', '完成医生复诊', '领取处方药品', '购买检测工具', '整理药品和工具', '同步处理结果']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
})

test('MiniMax failure preserves the original input and never creates a fallback draft', async ({ page }) => {
  await page.unroute('**/api/agent')
  await page.route('**/api/agent', (route) => route.fulfill({ status: 504, contentType: 'application/json', body: JSON.stringify({ error: 'minimax-unavailable' }) }))
  await page.goto('/matters/new')
  const original = '请把这一整套复杂流程拆成每个可以确认的步骤。'
  await page.getByLabel('描述你想安排的事情').fill(original)
  await page.getByRole('button', { name: '发送给协作 Agent' }).click()
  await expect(page.getByText('Relay 不会生成简化模板')).toBeVisible()
  await expect(page.getByLabel('描述你想安排的事情')).toHaveValue(original)
  await expect(page.getByText('计划会在这里形成')).toBeVisible()
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
