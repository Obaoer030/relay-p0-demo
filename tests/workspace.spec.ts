import { expect, test } from '@playwright/test'

test.beforeEach(async ({ request }) => {
  await request.delete('/api/workspace')
})

test('complete workspace exposes real seeded modules and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
  await expect(page.getByText('周六带布丁完成复诊').first()).toBeVisible()
  await expect(page.getByRole('navigation', { name: '产品导航' })).toBeVisible()

  await page.getByRole('link', { name: '事项', exact: true }).click()
  await expect(page.getByRole('heading', { name: '所有事项' })).toBeVisible()
  await expect(page.getByText('10 个事项')).toBeVisible()

  await page.getByRole('link', { name: '协作', exact: true }).click()
  await expect(page.getByRole('heading', { name: '协作进度' })).toBeVisible()
  await page.getByRole('link', { name: '关系人', exact: true }).click()
  await expect(page.getByRole('heading', { name: '关系人' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '小雨' })).toBeVisible()
})

test('a judge can create, persist, edit, transfer, and find a matter', async ({ page }) => {
  await page.goto('/matters')
  await page.getByRole('link', { name: '新建事项' }).click()
  await page.getByRole('button', { name: '手动填写' }).click()
  await page.getByLabel('标题 *').fill('周日确认新家燃气开通')
  await page.getByLabel('背景').fill('搬家前需要确认燃气表和开通材料。')
  await page.getByLabel('明确的下一步 *').fill('木木拍下燃气表编号并发给林然')
  await page.getByLabel('完成标准 *').fill('表号和开通材料清单已经确认')
  await page.getByLabel('什么情况要先联系我').fill('如需签约或产生费用，先联系林然。')
  await page.getByLabel('分类').selectOption('搬家')
  await page.getByLabel('这一步由谁处理').selectOption('invite')
  await page.getByLabel('邀请谁确认').selectOption('xiaoyu')
  await page.getByRole('button', { name: '保存事项' }).click()

  await expect(page.getByRole('heading', { name: '周日确认新家燃气开通' })).toBeVisible()
  await expect(page.getByText('木木拍下燃气表编号并发给林然')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem('relay:workspace-state'))).toContain('周日确认新家燃气开通')
  await page.reload()
  await expect(page.getByRole('heading', { name: '周日确认新家燃气开通' })).toBeVisible()
  await expect(page.getByText('正在等待对方确认是否负责')).toBeVisible()
  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
  await page.getByRole('button', { name: /可以，我来处理/ }).click()
  await expect(page.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible()
  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')

  await page.goto('/matters')
  await page.getByPlaceholder('搜索标题、下一步或场景').fill('燃气')
  await expect(page.getByText('1 个事项')).toBeVisible()
  await expect(page.getByText('周日确认新家燃气开通')).toBeVisible()

  await page.goto('/activity')
  await expect(page.getByText('小雨确认负责“周日确认新家燃气开通”')).toBeVisible()
})

test('product background explains why Relay is independent from chat', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: '让聊天里说好的事，有清楚的负责人和进度' })).toBeVisible()
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
  await page.locator('.workspace-mobile-header').getByLabel('切换用户视角').selectOption('xiaoyu')
  await expect(page.getByText('5 个事项')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('overview headline keeps its two semantic lines without isolated characters', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 })
  await page.goto('/')
  const lines = page.locator('.relay-command-headline > span')
  await expect(lines).toHaveCount(2)
  await expect(lines.nth(0)).toHaveText('下一步')
  await expect(lines.nth(1)).toHaveText('交给对的人')
  expect(await lines.evaluateAll((elements) => elements.every((element) => element.getClientRects().length === 1))).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('Relay Signal OS is original, responsive, and motion-safe', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.locator('.workspace-system-rail')).toBeVisible()
  await expect(page.getByText('责任信号在线')).toBeVisible()
  await expect(page.locator('.relay-signal-cursor')).toBeHidden()
  await expect(page.locator('.workspace-route-scan')).toHaveCSS('animation-name', 'none')
  await expect(page.getByText('PICO', { exact: true })).toHaveCount(0)
  await expect(page.getByText('NL/OS', { exact: true })).toHaveCount(0)

  await page.setViewportSize({ width: 375, height: 812 })
  await expect(page.locator('.workspace-system-rail')).toBeHidden()
  await expect(page.getByRole('navigation', { name: '移动端产品导航' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('four perspectives expose distinct seeded datasets from the same workspace state', async ({ page }) => {
  await page.goto('/matters')
  await expect(page.getByText('10 个事项')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
  await expect(page.getByText('5 个事项')).toBeVisible()
  await expect(page.getByText('整理下月露营装备清单')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('sister')
  await expect(page.getByText('3 个事项')).toBeVisible()
  await expect(page.getByText('给妈妈续配慢病处方')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('chenyu')
  await expect(page.getByText('3 个事项')).toBeVisible()
  await expect(page.getByText('续办小区停车证')).toBeVisible()
})

test('an invitation flows from Lin Ran to Xiaoyu and completion is visible to both', async ({ page }) => {
  await page.goto('/handoffs')
  await expect(page.getByText('去物业代领新的门禁卡')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
  await expect(page.getByRole('heading', { name: '等我确认' })).toBeVisible()
  await page.getByText('去物业代领新的门禁卡').click()
  await expect(page.getByRole('button', { name: /可以，我来处理/ })).toBeVisible()
  await page.getByRole('button', { name: /可以，我来处理/ }).click()
  await expect(page.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible()
  await expect(page.getByText('下一步由我处理')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')
  await expect(page.getByText('对方已经确认负责下一步')).toBeVisible()
  await expect(page.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
  await page.getByRole('button', { name: /确认完成并同步结果/ }).click()
  await expect(page.getByRole('heading', { name: '这件事已经完成' })).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')
  await expect(page.getByRole('heading', { name: '这件事已经完成' })).toBeVisible()
  await page.goto('/activity')
  await expect(page.getByText('小雨完成了“去物业代领新的门禁卡”')).toBeVisible()
})

test('an invitee can decline and the matter returns to the creator', async ({ page }) => {
  await page.goto('/matters')
  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('chenyu')
  await page.getByText('参加周日晚家庭视频').click()
  await page.getByRole('button', { name: /这次我不方便/ }).click()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('sister')
  await page.getByText('参加周日晚家庭视频').click()
  await expect(page.getByText('下一步由我处理')).toBeVisible()
  await expect(page.locator('.workspace-detail-hero__owner').getByText('姐姐')).toBeVisible()

  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('chenyu')
  await expect(page.getByRole('heading', { name: '所有事项' })).toBeVisible()
  await expect(page.getByText('参加周日晚家庭视频')).toHaveCount(0)
})
