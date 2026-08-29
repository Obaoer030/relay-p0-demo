import { expect, test } from '@playwright/test'

test('complete workspace exposes real seeded modules and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByText('周六带布丁完成复诊').first()).toBeVisible()
  await expect(page.getByRole('navigation', { name: '产品导航' })).toBeVisible()

  await page.getByRole('link', { name: '事项', exact: true }).click()
  await expect(page.getByRole('heading', { name: '所有事项' })).toBeVisible()
  await expect(page.getByText('8 个事项')).toBeVisible()

  await page.getByRole('link', { name: '接棒', exact: true }).click()
  await expect(page.getByRole('heading', { name: '接棒管理' })).toBeVisible()
  await page.getByRole('link', { name: '关系人', exact: true }).click()
  await expect(page.getByRole('heading', { name: '关系人' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '小雨' })).toBeVisible()
})

test('a judge can create, persist, edit, transfer, and find a matter', async ({ page }) => {
  await page.goto('/matters')
  await page.getByRole('link', { name: '新建事项' }).click()
  await page.getByLabel('标题 *').fill('周日确认新家燃气开通')
  await page.getByLabel('背景').fill('搬家前需要确认燃气表和开通材料。')
  await page.getByLabel('明确的下一步 *').fill('木木拍下燃气表编号并发给林然')
  await page.getByLabel('完成标准 *').fill('表号和开通材料清单已经确认')
  await page.getByLabel('责任边界').fill('如需签约或产生费用，先联系林然。')
  await page.getByLabel('分类').selectOption('搬家')
  await page.getByRole('button', { name: '保存事项' }).click()

  await expect(page.getByRole('heading', { name: '周日确认新家燃气开通' })).toBeVisible()
  await expect(page.getByText('木木拍下燃气表编号并发给林然')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: '周日确认新家燃气开通' })).toBeVisible()

  await page.getByRole('link', { name: '编辑' }).click()
  await page.getByLabel('当前责任人').selectOption('木木')
  await page.getByLabel('当前状态').selectOption('relayed')
  await page.getByRole('button', { name: '保存事项' }).click()
  await expect(page.getByText('当前责任').locator('..').getByText('木木')).toBeVisible()

  await page.goto('/matters')
  await page.getByPlaceholder('搜索标题、下一步或场景').fill('燃气')
  await expect(page.getByText('1 个事项')).toBeVisible()
  await expect(page.getByText('周日确认新家燃气开通')).toBeVisible()

  await page.goto('/activity')
  await expect(page.getByText('更新了“周日确认新家燃气开通”')).toBeVisible()
})

test('product background explains why Relay is independent from chat', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: '让责任离开聊天流，成为可见的生活状态' })).toBeVisible()
  await expect(page.getByText('微信聊天与 Relay')).toBeVisible()
  await expect(page.getByText('按事项保存持续状态')).toBeVisible()
  await expect(page.getByText('一个网址，手机和电脑都能直接打开。')).toBeVisible()
})

test('mobile workspace uses bottom navigation without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: '移动端产品导航' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: '产品导航', exact: true })).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

  await page.getByRole('link', { name: '事项', exact: true }).click()
  await expect(page.getByRole('heading', { name: '所有事项' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
