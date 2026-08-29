import { expect, type Page, test } from '@playwright/test'

async function startFromReset(page: Page) {
  await page.goto('/demo')
  await page.getByRole('button', { name: '重置' }).click()
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByLabel('责任状态：下一步由林然推进')).toBeVisible()
}

export async function runGoldenPath(page: Page, alreadyReset = false) {
  if (!alreadyReset) await startFromReset(page)
  const pathStartedAt = Date.now()

  await page.getByRole('button', { name: /先倒出来/ }).click()
  await expect(page.getByRole('dialog', { name: '确认事项包' })).toBeVisible()
  await expect(page.getByText('决定仍在林然这里')).toBeVisible()

  await page.getByRole('button', { name: '继续看接棒预览' }).click()
  await expect(page.getByRole('dialog', { name: '接棒预览' })).toBeVisible()
  await expect(page.getByText('对方只会看到这一件事')).toBeVisible()

  await page.getByRole('button', { name: '请小雨接住' }).click()
  await expect(page.getByRole('heading', { name: '你是否愿意接住这件事？' })).toBeVisible()
  await expect(page.getByLabel('责任状态：已发给小雨，等待她回应')).toHaveCount(2)

  const transferStartedAt = Date.now()
  await page.getByRole('button', { name: '我愿意接住' }).click()
  await expect(page.getByText('这件事已经有人推进。')).toBeVisible()
  await expect(page.getByLabel('责任状态：当前由小雨推进')).toHaveCount(2)
  await expect(page.getByText('除非超出约定边界，你不需要主动追问。')).toBeVisible()
  expect(Date.now() - transferStartedAt).toBeLessThan(5_000)
  expect(Date.now() - pathStartedAt).toBeLessThan(45_000)

  await page.getByRole('button', { name: '我已完成本次执行' }).click()
  await expect(page.getByRole('heading', { name: '布丁已经安全回家' })).toBeVisible()
  await expect(page.getByText('布丁已完成复诊并安全回家。')).toBeVisible()

  await page.getByRole('button', { name: '重置' }).click()
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByLabel('责任状态：下一步由林然推进')).toBeVisible()
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
