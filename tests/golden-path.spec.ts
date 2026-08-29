import { expect, type Page, test } from '@playwright/test'

async function resetWorkspace(page: Page) {
  await page.goto('/settings')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: '恢复演示数据' }).click()
  await expect(page.getByText('4 个可切换视角、14 个共享事项')).toBeVisible()
}

export async function runGoldenPath(page: Page) {
  await resetWorkspace(page)
  await page.goto('/demo')
  await expect(page).toHaveURL(/\/\?demo=complete$/)
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('heading', { name: '周六带布丁完成复诊' })).toBeVisible()
  await page.getByRole('button', { name: '可以，我来处理' }).click()
  await expect(page.getByRole('heading', { name: '这一步现在由小雨负责' })).toBeVisible()
  await page.getByRole('button', { name: '确认完成并同步结果' }).click()
  await expect(page.getByRole('heading', { name: '事项已经完成' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{}') as { matters?: Array<{ id: string; status: string }> }
    return state.matters?.find((matter) => matter.id === 'ws-cat-checkup')?.status
  })).toBe('completed')
  await page.goto('/matters/ws-cat-checkup')
  await expect(page.getByRole('heading', { name: '这件事已经完成' })).toBeVisible()
  await expect(page.getByText('布丁完成复诊并安全回家，复诊结论发给林然').first()).toBeVisible()
  await page.getByRole('button', { name: '重新打开事项' }).click()
  await expect(page.getByText('下一步由我处理')).toBeVisible()
  await resetWorkspace(page)
}

test.beforeEach(async ({ page, request }) => {
  await request.delete('/api/workspace')
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('relay:test-initialized')) {
      localStorage.clear()
      sessionStorage.setItem('relay:test-initialized', '1')
    }
  })
})

test('deterministic complete-product golden path works without typing', async ({ page }) => {
  const started = Date.now()
  await runGoldenPath(page)
  expect(Date.now() - started).toBeLessThan(45_000)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('already loaded collaboration flow completes offline without external requests', async ({ context, page }) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url())
  })
  await page.goto('/r/demo-cat-checkup')
  await context.setOffline(true)
  await page.getByRole('button', { name: '可以，我来处理' }).click()
  await page.getByRole('button', { name: '确认完成并同步结果' }).click()
  await expect(page.getByRole('heading', { name: '事项已经完成' })).toBeVisible()
  expect(await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{}') as { matters?: Array<{ id: string; status: string }> }
    return state.matters?.find((matter) => matter.id === 'ws-cat-checkup')?.status
  })).toBe('completed')
  expect(externalRequests).toEqual([])
})
