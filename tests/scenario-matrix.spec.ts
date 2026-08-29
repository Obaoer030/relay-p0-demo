import { expect, type Browser, type Page, test } from '@playwright/test'
import { installAgentFixture } from './agentFixture.ts'

test.beforeEach(async ({ page, request }) => {
  await request.delete('/api/workspace')
  await installAgentFixture(page)
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('relay:scenario-matrix-initialized')) {
      localStorage.clear()
      sessionStorage.setItem('relay:scenario-matrix-initialized', '1')
    }
  })
})

async function createManualMatter(page: Page, title: string, invite = false) {
  await page.goto('/matters/new')
  await page.getByRole('button', { name: '手动填写' }).click()
  await page.getByLabel('标题 *').fill(title)
  await page.getByLabel('背景').fill('用于完整用户场景测试的真实事项。')
  await page.getByLabel('明确的下一步 *').fill('按约定完成下一步并同步结果')
  await page.getByLabel('完成标准 *').fill('结果已经记录且相关人可以看到')
  await page.getByLabel('什么情况要先联系我').fill('时间、范围或费用变化时先联系发起者。')
  if (invite) {
    await page.getByLabel('这一步由谁处理').selectOption('invite')
    await page.getByLabel('邀请谁确认').selectOption('xiaoyu')
  }
  await page.getByRole('button', { name: '保存事项' }).click()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()
}

async function acceptAccessCard(page: Page) {
  await page.goto('/matters/ws-access-card')
  await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
  await page.getByRole('button', { name: /可以，我来处理/ }).click()
  await expect(page.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible()
}

async function completeAccessCard(page: Page, note: string) {
  await acceptAccessCard(page)
  await page.getByLabel('完成结果').fill(note)
  await page.getByRole('button', { name: /确认完成并同步结果/ }).click()
  await expect(page.getByRole('heading', { name: '这件事已经完成' })).toBeVisible()
}

test.describe('场景 01 · 入口与模块导航', () => {
  test('01.1 首页展示当前用户、预制事项和产品导航', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
    await expect(page.getByText('周六带布丁完成复诊').first()).toBeVisible()
    await expect(page.getByRole('navigation', { name: '产品导航' })).toBeVisible()
  })

  test('01.2 顶部导航可依次进入事项、协作、关系人与动态', async ({ page }) => {
    await page.goto('/')
    for (const [link, heading] of [['事项', '所有事项'], ['协作', '协作进度'], ['关系人', '关系人'], ['动态', '活动记录']] as const) {
      await page.getByRole('link', { name: link, exact: true }).click()
      await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    }
  })

  test('01.3 完整演示入口回到同一工作台而非独立假页面', async ({ page }) => {
    await page.goto('/demo')
    await expect(page).toHaveURL(/\/?\?demo=complete$/)
    await expect(page.getByRole('heading', { name: '早上好，林然' })).toBeVisible()
    await expect(page.getByText('演示阶段')).toHaveCount(0)
  })
})

test.describe('场景 02 · 多用户视角', () => {
  test('02.1 林然视角显示 10 个相关事项', async ({ page }) => {
    await page.goto('/matters')
    await expect(page.getByText('10 个事项')).toBeVisible()
    await expect(page.getByText('去物业代领新的门禁卡')).toBeVisible()
  })

  test('02.2 小雨视角显示独立的 5 个相关事项', async ({ page }) => {
    await page.goto('/matters')
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
    await expect(page.getByText('5 个事项')).toBeVisible()
    await expect(page.getByText('整理下月露营装备清单')).toBeVisible()
  })

  test('02.3 姐姐与陈屿视角显示各自数据且不会复制工作区', async ({ page }) => {
    await page.goto('/matters')
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('sister')
    await expect(page.getByText('3 个事项')).toBeVisible()
    await expect(page.getByText('给妈妈续配慢病处方')).toBeVisible()
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('chenyu')
    await expect(page.getByText('3 个事项')).toBeVisible()
    await expect(page.getByText('续办小区停车证')).toBeVisible()
  })
})

test.describe('场景 03 · 搜索、筛选与空状态', () => {
  test('03.1 搜索可从标题和下一步找到布丁复诊', async ({ page }) => {
    await page.goto('/matters')
    await page.getByPlaceholder('搜索标题、下一步或场景').fill('布丁')
    await expect(page.getByText('周六带布丁完成复诊')).toBeVisible()
    expect(await page.locator('.workspace-matter-card').count()).toBeGreaterThan(0)
  })

  test('03.2 等待回复筛选只保留对应状态卡片', async ({ page }) => {
    await page.goto('/matters')
    await page.getByRole('button', { name: '等待回复', exact: true }).click()
    const cards = page.locator('.workspace-matter-card')
    expect(await cards.count()).toBeGreaterThan(0)
    await expect(page.locator('.workspace-matter-card:not([data-status="waiting"])')).toHaveCount(0)
  })

  test('03.3 无匹配关键词时显示可理解空状态', async ({ page }) => {
    await page.goto('/matters')
    await page.getByPlaceholder('搜索标题、下一步或场景').fill('完全不存在的事项关键词')
    await expect(page.getByRole('heading', { name: '没有匹配的事项' })).toBeVisible()
    await expect(page.getByText('换一个关键词或状态')).toBeVisible()
  })
})

test.describe('场景 04 · 手动创建事项', () => {
  test('04.1 用户可创建由自己处理的完整事项', async ({ page }) => {
    await createManualMatter(page, '场景测试 · 自己处理')
    await expect(page.getByText('下一步由我处理')).toBeVisible()
    await expect(page.getByText('按约定完成下一步并同步结果')).toBeVisible()
  })

  test('04.2 用户可创建邀请小雨确认的事项', async ({ page }) => {
    await createManualMatter(page, '场景测试 · 邀请小雨', true)
    await expect(page.getByText('正在等待对方确认是否负责')).toBeVisible()
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
    await expect(page.getByRole('button', { name: /可以，我来处理/ })).toBeVisible()
  })

  test('04.3 创建结果在刷新后保留并写入活动记录', async ({ page }) => {
    const title = '场景测试 · 持久化事项'
    await createManualMatter(page, title, true)
    await page.reload()
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await page.goto('/activity')
    await expect(page.getByText(`创建并发出了“${title}”`)).toBeVisible()
  })
})

test.describe('场景 05 · Agent 对话创建', () => {
  test('05.1 示例消息可点击带入输入框并保持可编辑', async ({ page }) => {
    await page.goto('/matters/new')
    await page.getByRole('button', { name: '我周五临时出差，想请小雨周六带布丁复诊。' }).click()
    await expect(page.getByLabel('描述你想安排的事情')).toHaveValue('我周五临时出差，想请小雨周六带布丁复诊。')
  })

  test('05.2 信息不完整时只追问时间且不创建事项', async ({ page }) => {
    await page.goto('/matters/new')
    const before = await page.evaluate(() => (JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{"matters":[]}') as { matters: unknown[] }).matters.length)
    await page.getByLabel('描述你想安排的事情').fill('我出差，想请小雨周六带布丁复诊。')
    await page.getByRole('button', { name: '发送给协作 Agent' }).click()
    await expect(page.getByText('复诊预约的具体时间是什么？')).toBeVisible()
    const after = await page.evaluate(() => (JSON.parse(localStorage.getItem('relay:workspace-state') ?? '{"matters":[]}') as { matters: unknown[] }).matters.length)
    expect(after).toBe(before)
  })

  test('05.3 完整输入生成三步计划、可改负责人并确认发布', async ({ page }) => {
    await page.goto('/matters/new')
    await page.getByLabel('描述你想安排的事情').fill('请小雨周六上午 9:30 带布丁复诊。')
    await page.getByRole('button', { name: '发送给协作 Agent' }).click()
    await expect(page.getByRole('button', { name: '确认并创建 3 个步骤' })).toBeEnabled()
    await page.getByLabel('步骤 1 负责人').selectOption('sister')
    await page.getByRole('button', { name: '确认并创建 3 个步骤' }).click()
    await expect(page.getByText('Agent 计划第 1/3 步')).toBeVisible()
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('sister')
    await expect(page.getByRole('button', { name: /可以，我来处理/ })).toBeVisible()
  })
})

test.describe('场景 06 · 邀请响应', () => {
  test('06.1 小雨接受邀请后负责人立即变为小雨', async ({ page }) => {
    await acceptAccessCard(page)
    await expect(page.getByText('下一步由我处理')).toBeVisible()
  })

  test('06.2 小雨可提出调整并让林然看到原文', async ({ page }) => {
    await page.goto('/matters/ws-access-card')
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('xiaoyu')
    await page.getByRole('button', { name: /我需要先调整约定/ }).click()
    await page.getByLabel('需要调整什么？').fill('请改到周六上午，我再处理。')
    await page.getByRole('button', { name: '发送调整建议' }).click()
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')
    await expect(page.getByText('请改到周六上午，我再处理。')).toBeVisible()
  })

  test('06.3 陈屿拒绝后事项回到姐姐且从陈屿列表消失', async ({ page }) => {
    await page.goto('/matters')
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('chenyu')
    await page.getByText('参加周日晚家庭视频').click()
    await page.getByRole('button', { name: /这次我不方便/ }).click()
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('sister')
    await page.getByText('参加周日晚家庭视频').click()
    await expect(page.locator('.workspace-detail-hero__owner').getByText('姐姐')).toBeVisible()
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('chenyu')
    await expect(page).toHaveURL(/\/matters$/)
    await expect(page.getByText('参加周日晚家庭视频')).toHaveCount(0)
  })
})

test.describe('场景 07 · 完成、结果同步与重开', () => {
  test('07.1 当前负责人可填写结果并完成事项', async ({ page }) => {
    await completeAccessCard(page, '门禁卡已领取并放进信箱。')
    await expect(page.getByText('门禁卡已领取并放进信箱。').first()).toBeVisible()
  })

  test('07.2 林然切回后能看到小雨填写的完成结果', async ({ page }) => {
    await completeAccessCard(page, '门禁卡已领取，照片也已发送。')
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')
    await expect(page.getByText('门禁卡已领取，照片也已发送。').first()).toBeVisible()
  })

  test('07.3 发起者可重新打开已完成事项并取回下一步', async ({ page }) => {
    await completeAccessCard(page, '门禁卡已经处理完成。')
    await page.locator('.workspace-topbar').getByLabel('切换用户视角').selectOption('linran')
    await page.getByRole('button', { name: '重新打开事项' }).click()
    await expect(page.getByText('下一步由我处理')).toBeVisible()
    await expect(page.locator('.workspace-detail-hero__owner').getByText('林然')).toBeVisible()
  })
})

test.describe('场景 08 · 公开协作链接', () => {
  test('08.1 有效链接展示下一步、完成标准和联系边界', async ({ page }) => {
    await page.goto('/r/demo-cat-checkup')
    await expect(page.getByRole('heading', { name: '周六带布丁完成复诊' })).toBeVisible()
    await expect(page.getByText('08:40 接到布丁，09:20 前到达诊所')).toBeVisible()
    await expect(page.getByText('如建议手术、住院、更改方案或产生重大费用')).toBeVisible()
  })

  test('08.2 无效链接不泄露任何事项内容', async ({ page }) => {
    await page.goto('/r/not-a-real-token')
    await expect(page.getByRole('heading', { name: '这个协作链接不可用' })).toBeVisible()
    await expect(page.getByText('周六带布丁完成复诊')).toHaveCount(0)
    await expect(page.getByText('08:40 接到布丁')).toHaveCount(0)
  })

  test('08.3 无账号协作者可接受并提交完成结果', async ({ page }) => {
    await page.goto('/r/demo-cat-checkup')
    await page.getByRole('button', { name: '可以，我来处理' }).click()
    await expect(page.getByRole('heading', { name: '这一步现在由小雨负责' })).toBeVisible()
    await page.getByLabel('完成结果').fill('布丁已完成复诊并安全回家。')
    await page.getByRole('button', { name: '确认完成并同步结果' }).click()
    await expect(page.getByRole('heading', { name: '事项已经完成' })).toBeVisible()
  })
})

test.describe('场景 09 · 同步与离线', () => {
  test('09.1 同一浏览器两个页面在 500ms 内同步接受结果', async ({ context }) => {
    const owner = await context.newPage()
    const helper = await context.newPage()
    await owner.goto('/matters/ws-cat-checkup')
    await helper.goto('/r/demo-cat-checkup')
    const started = Date.now()
    await helper.getByRole('button', { name: '可以，我来处理' }).click()
    await expect(owner.getByText('对方已经确认负责下一步')).toBeVisible({ timeout: 500 })
    expect(Date.now() - started).toBeLessThan(500)
  })

  test('09.2 隔离的电脑和手机浏览器共享同一状态', async ({ browser, request }) => {
    await verifyIsolatedDeviceSync(browser, request)
  })

  test('09.3 页面加载后断网仍可接受并完成事项', async ({ context, page }) => {
    const external: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url())
    })
    await page.goto('/r/demo-cat-checkup')
    await context.setOffline(true)
    await page.getByRole('button', { name: '可以，我来处理' }).click()
    await page.getByRole('button', { name: '确认完成并同步结果' }).click()
    await expect(page.getByRole('heading', { name: '事项已经完成' })).toBeVisible()
    expect(external).toEqual([])
  })
})

async function verifyIsolatedDeviceSync(browser: Browser, request: { delete(url: string): Promise<unknown> }) {
  await request.delete('/api/workspace')
  const computerContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const phoneContext = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const computer = await computerContext.newPage()
  const phone = await phoneContext.newPage()
  try {
    await computer.goto('/matters/ws-cat-checkup')
    await phone.goto('/r/demo-cat-checkup')
    await phone.getByRole('button', { name: '可以，我来处理' }).click()
    await expect(computer.locator('.workspace-detail-hero__owner').getByText('小雨')).toBeVisible({ timeout: 1_000 })
  } finally {
    await computerContext.close()
    await phoneContext.close()
  }
}

test.describe('场景 10 · 手机、动效设置与恢复', () => {
  test('10.1 375×812 使用底部导航且主操作满足 44px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/r/demo-cat-checkup')
    const action = page.getByRole('button', { name: '可以，我来处理' })
    await expect(action).toBeVisible()
    const box = await action.boundingBox()
    expect(box?.height).toBeGreaterThanOrEqual(44)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test('10.2 用户可在设置中开启减少动态并在刷新后保留', async ({ page }) => {
    await page.goto('/settings')
    const toggle = page.getByRole('checkbox')
    await toggle.check()
    await expect(page.getByText('已开启')).toBeVisible()
    await page.reload()
    await expect(toggle).toBeChecked()
  })

  test('10.3 恢复演示数据会删除临时事项并恢复 14 条共享数据', async ({ page }) => {
    const title = '场景测试 · 将被恢复操作删除'
    await createManualMatter(page, title)
    await page.goto('/settings')
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: '恢复演示数据' }).click()
    await expect(page.getByText('4 个可切换视角、14 个共享事项')).toBeVisible()
    await page.goto('/matters')
    await expect(page.getByText(title)).toHaveCount(0)
  })
})
