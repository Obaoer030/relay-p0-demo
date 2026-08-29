import { expect, test } from '@playwright/test'

const heroMatter = '周六带布丁完成复诊'

test('same-origin helper response synchronizes to the owner within 500ms', async ({ browser }) => {
  const context = await browser.newContext()
  const owner = await context.newPage()
  const helper = await context.newPage()

  await owner.goto('/')
  await owner.evaluate(() => localStorage.clear())
  await owner.reload()
  await helper.goto('/r/demo-cat-checkup')

  await owner.getByRole('button', { name: /周五出差，想请小雨接住布丁复诊/ }).click()
  await owner.getByRole('button', { name: '继续看接棒预览' }).click()
  await owner.getByRole('button', { name: '请小雨接住' }).click()
  await expect(helper.getByRole('heading', { name: '你是否愿意接住这件事？' })).toBeVisible({ timeout: 500 })

  const acceptedAt = Date.now()
  await helper.getByRole('button', { name: '我愿意接住' }).click()
  await expect(owner.getByLabel('责任状态：当前由小雨推进')).toBeVisible({ timeout: 500 })
  expect(Date.now() - acceptedAt).toBeLessThanOrEqual(500)

  await context.close()
})

test('invalid share token does not disclose matter data', async ({ page }) => {
  await page.goto('/r/not-a-real-token')

  await expect(page.getByRole('heading', { name: '没有可以打开的事项' })).toBeVisible()
  await expect(page.getByText(heroMatter)).toHaveCount(0)
})

test('mobile product view has no horizontal overflow and keeps core controls visible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const dimensions = await page.evaluate<{ clientWidth: number; scrollWidth: number }>(
    '({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth })',
  )

  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)
  await expect(page.getByRole('button', { name: '倒出一件事' })).toBeVisible()
  await expect(page.getByText(heroMatter)).toBeVisible()
})

test('320px reflow keeps the primary handoff path usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')

  await expect(page.getByRole('button', { name: /周五出差，想请小雨接住布丁复诊/ })).toBeVisible()
  const dimensions = await page.evaluate<{ clientWidth: number; scrollWidth: number }>(
    '({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth })',
  )
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)
})

test('reduced-motion mode preserves responsibility semantics', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/demo')
  await page.getByRole('button', { name: '已接住' }).click()

  await expect(page.getByLabel('责任状态：当前由小雨推进').first()).toBeVisible()
  await expect(page.getByText('除非超出约定边界，你不需要主动追问。')).toBeVisible()
})

test('decline returns responsibility without blame', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: '已分享' }).click()
  await page.getByRole('button', { name: '这次暂时无法帮忙' }).click()

  await expect(page.getByText('说清自己的边界，也是一种可靠。')).toBeVisible()
  await expect(page.getByText('事情已回到“需要我推进”。')).toBeVisible()
})

test('loaded production experience completes without network requests', async ({ page, context }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/demo')
  await context.setOffline(true)

  await page.getByRole('button', { name: '已接住' }).click()
  await expect(page.getByLabel('责任状态：当前由小雨推进').first()).toBeVisible()
  await page.getByRole('button', { name: '我已完成本次执行' }).click()
  await expect(page.getByRole('heading', { name: '布丁已经安全回家' })).toBeVisible()

  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4173/'))).toBe(true)
})
