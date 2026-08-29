import { expect, test } from '@playwright/test'

const heroMatter = '周六带布丁完成复诊'

test.beforeEach(async ({ page }) => {
  await page.goto('/demo')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('golden path transfers and completes bounded responsibility', async ({ page }) => {
  await page.getByRole('button', { name: /周五出差，想请小雨接住布丁复诊/ }).click()
  await expect(page.getByRole('dialog', { name: '确认事项包' })).toContainText('决定仍在林然这里')

  await page.getByRole('button', { name: '继续看接棒预览' }).click()
  await expect(page.getByRole('dialog', { name: '接棒预览' })).toContainText('对方只会看到这一件事')

  await page.getByRole('button', { name: '请小雨接住' }).click()
  await expect(page.getByRole('heading', { name: '你是否愿意接住这件事？' })).toBeVisible()

  await page.getByRole('button', { name: '我愿意接住' }).click()
  await expect(page.getByLabel('责任状态：当前由小雨推进').first()).toBeVisible()
  await expect(page.getByText('除非超出约定边界，你不需要主动追问。')).toBeVisible()

  await page.getByRole('button', { name: '我已完成本次执行' }).click()
  await expect(page.getByRole('heading', { name: '布丁已经安全回家' })).toBeVisible()

  await page.getByRole('button', { name: '重置' }).click()
  await expect(page.getByText(heroMatter).first()).toBeVisible()
  await expect(page.getByLabel('责任状态：下一步由林然推进')).toBeVisible()
})
