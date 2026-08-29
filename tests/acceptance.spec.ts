import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
})

test('required routes and safe invalid-token state render from the production build', async ({ page }) => {
  for (const path of ['/', '/demo', '/r/demo-cat-checkup']) {
    await page.goto(path)
    await expect(page.locator('#root')).not.toBeEmpty()
  }

  await page.goto('/r/not-a-real-token')
  await expect(page.getByRole('heading', { name: '没有可以打开的事项' })).toBeVisible()
  await expect(page.getByText('周六带布丁完成复诊')).toHaveCount(0)
})

test('same-origin helper acceptance reaches the owner view within 500ms', async ({ context }) => {
  const owner = await context.newPage()
  const helper = await context.newPage()

  await owner.goto('/demo')
  await owner.getByRole('button', { name: '重置' }).click()
  await helper.goto('/r/demo-cat-checkup')
  await expect(helper.getByRole('heading', { name: '分享后，请求会在这里展开' })).toBeVisible()

  await owner.getByRole('button', { name: /先倒出来/ }).click()
  await owner.getByRole('button', { name: '继续看接棒预览' }).click()
  await owner.getByRole('button', { name: '请小雨接住' }).click()
  await expect(helper.getByRole('button', { name: '我愿意接住' })).toBeVisible({ timeout: 500 })

  const startedAt = Date.now()
  await helper.getByRole('button', { name: '我愿意接住' }).click()
  await expect(owner.getByText('这件事已经有人推进。')).toBeVisible({ timeout: 500 })
  expect(Date.now() - startedAt).toBeLessThan(500)
  await expect(owner.getByLabel('责任状态：当前由小雨推进').first()).toHaveAttribute('data-owner', 'xiaoyu')
})

test('decline, completion, and repeated actions preserve legal whole states', async ({ page }) => {
  await page.goto('/demo')
  await page.getByRole('button', { name: '已分享', exact: true }).click()
  await page.getByRole('button', { name: '这次暂时无法帮忙' }).click()
  await expect(page.getByText('事情已回到“需要我推进”')).toBeVisible()
  await expect(page.getByLabel(/责任状态：小雨这次暂时无法帮忙/)).toBeVisible()

  await page.getByRole('button', { name: '已接住', exact: true }).click()
  const complete = page.getByRole('button', { name: '我已完成本次执行' })
  await complete.click()
  await expect(page.getByRole('heading', { name: '布丁已经安全回家' })).toBeVisible()
  await expect(complete).toHaveCount(0)
  await expect(page.getByLabel('责任状态：小雨已完成本次执行')).toBeVisible()
})

test('reduced motion preserves the responsibility transfer semantics', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/demo')
  await page.getByLabel('减少动态').check()
  await page.getByRole('button', { name: '已分享', exact: true }).click()
  await page.getByRole('button', { name: '我愿意接住' }).click()

  const rails = page.getByLabel('责任状态：当前由小雨推进')
  await expect(rails).toHaveCount(2)
  await expect(rails.first()).toHaveAttribute('data-owner', 'xiaoyu')
  await expect(page.getByText('除非超出约定边界，你不需要主动追问。')).toBeVisible()
  const animationDuration = await page.locator('.responsibility-rail__active').first().evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).animationDuration),
  )
  expect(animationDuration).toBeLessThanOrEqual(0.001)
})

test('mobile product views have no horizontal overflow and keep critical targets at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const mobileMetrics = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')]
      .filter((button) => {
        const style = getComputedStyle(button)
        return style.display !== 'none' && style.visibility !== 'hidden'
      })
      .map((button) => {
        const rect = button.getBoundingClientRect()
        return { label: button.getAttribute('aria-label') ?? button.textContent?.trim(), width: rect.width, height: rect.height }
      })
    return {
      fits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      buttons,
    }
  })

  expect(mobileMetrics.fits).toBe(true)
  expect(mobileMetrics.buttons.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true)

  await page.goto('/r/demo-cat-checkup')
  await expect(page.getByRole('heading', { name: '分享后，请求会在这里展开' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('presenter controls expose 44px interaction targets', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/demo')
  const targets = await page.locator('.demo-controller button, .motion-toggle').evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    }),
  )

  expect(
    targets.every(({ width, height }) => width >= 44 && height >= 44),
    JSON.stringify(targets),
  ).toBe(true)
})

test('the demo remains operable at a 200-percent-equivalent CSS viewport', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 })
  await page.goto('/demo')
  await page.getByRole('button', { name: '已分享', exact: true }).click()
  await page.getByRole('button', { name: '我愿意接住' }).click()

  await expect(page.getByLabel('责任状态：当前由小雨推进').last()).toBeVisible()
  await expect(page.getByRole('button', { name: '我已完成本次执行' })).toBeVisible()
  expect(await page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  )).toBe(true)
})
