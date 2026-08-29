import { expect, type Page, test } from '@playwright/test'

async function startFromReset(page: Page) {
  await page.goto('/demo')
  await page.getByRole('button', { name: '重置' }).click()
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByLabel('负责人状态：这一步由林然处理')).toBeVisible()
}

export async function runGoldenPath(page: Page, alreadyReset = false) {
  if (!alreadyReset) await startFromReset(page)
  const pathStartedAt = Date.now()

  await page.getByRole('button', { name: /先倒出来/ }).click()
  await expect(page.getByRole('dialog', { name: '确认事项内容' })).toBeVisible()
  await expect(page.getByText('遇到这些情况，请先联系林然')).toBeVisible()

  await page.getByRole('button', { name: '下一步：确认发给小雨的内容' }).click()
  await expect(page.getByRole('dialog', { name: '邀请预览' })).toBeVisible()
  await expect(page.getByText('对方只会看到这一件事')).toBeVisible()

  await page.getByRole('button', { name: '发给小雨' }).click()
  await expect(page.getByRole('heading', { name: '你愿意负责这次复诊吗？' })).toBeVisible()
  await expect(page.getByLabel('负责人状态：等待小雨确认')).toHaveCount(2)

  const transferStartedAt = Date.now()
  await page.getByRole('button', { name: '可以，我来处理' }).click()
  await expect(page.getByText('这一步已经由小雨负责。')).toBeVisible()
  await expect(page.getByLabel('负责人状态：这一步由小雨负责')).toHaveCount(2)
  await expect(page.getByText('只要没有超出约定范围，你不需要继续催问。')).toBeVisible()
  expect(Date.now() - transferStartedAt).toBeLessThan(5_000)
  expect(Date.now() - pathStartedAt).toBeLessThan(45_000)

  await page.getByRole('button', { name: '这一步已完成' }).click()
  await expect(page.getByRole('heading', { name: '布丁已经安全回家' })).toBeVisible()
  await expect(page.getByText('布丁已完成复诊并安全回家。')).toBeVisible()

  await page.getByRole('button', { name: '重置' }).click()
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByLabel('负责人状态：这一步由林然处理')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
})

test('deterministic no-input golden path completes offline and resets', async ({ context, page }) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url())
  })

  await startFromReset(page)
  await context.setOffline(true)
  await runGoldenPath(page, true)

  expect(externalRequests).toEqual([])
  expect(await page.getByRole('textbox').count()).toBe(0)
  expect(await page.evaluate(() => ({
    pageX: window.scrollX,
    pageY: window.scrollY,
    widthFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  }))).toEqual({ pageX: 0, pageY: 0, widthFits: true })
})
