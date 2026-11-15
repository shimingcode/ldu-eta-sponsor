import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function enter(page: Page) {
  await page.goto('./')
  await expect(page.getByTestId('intro-screen')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: '任逸轩', exact: true }),
  ).toBeVisible({ timeout: 8_000 })
  await expect(page.getByTestId('intro-screen')).toHaveCount(0)
}

test('real five-second intro, refresh, valid base assets and clean console', async ({
  page,
}) => {
  const errors: string[] = []
  const failures: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(response.url())
  })
  await page.addInitScript(() => {
    const times = { intro: 0, home: 0 }
    Object.assign(window, { __introTimes: times })
    new MutationObserver(() => {
      if (
        !times.intro &&
        document.querySelector('[data-testid="intro-screen"]')
      )
        times.intro = performance.now()
      if (!times.home && document.querySelector('#sponsor-name'))
        times.home = performance.now()
    }).observe(document, { childList: true, subtree: true })
  })
  await enter(page)
  const elapsed = await page.evaluate(() => {
    const times = (
      window as unknown as { __introTimes: { intro: number; home: number } }
    ).__introTimes
    return times.home - times.intro
  })
  expect(elapsed).toBeGreaterThanOrEqual(4980)
  expect(elapsed).toBeLessThan(6200)
  await expect(page.locator('#sponsor-name')).toBeFocused()
  for (const id of [
    'about',
    'contributions',
    'honors',
    'activities',
    'thanks',
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await expect(page.locator(`#${id}`)).toBeVisible()
  }
  const images = page.locator('img')
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('src', /^\/ldu-eta-sponsor\/images\//)
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true)
  }
  expect(errors).toEqual([])
  expect(failures).toEqual([])
  await page.reload()
  await expect(page.getByTestId('intro-countdown')).toHaveText('5')
  await expect(page.locator('main')).toHaveCount(0)
  console.log(`Intro deadline observed: ${elapsed.toFixed(1)} ms`)
})

test('mobile navigation, narrow layout and keyboard dismissal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await enter(page)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.locator('#activities').scrollIntoViewIfNeeded()
  for (const image of await page.locator('img').all())
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({
    path: 'work/screenshots/home-mobile.png',
    fullPage: true,
  })
  await page.getByRole('button', { name: '打开菜单' }).click()
  await expect(page.getByRole('button', { name: '关闭菜单' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await page
    .locator('#mobile-menu')
    .getByRole('link', { name: '协会活动' })
    .click()
  await expect(page).toHaveURL(/#activities$/)
  await expect(page.locator('#mobile-menu')).toHaveCount(0)
  await page.getByRole('button', { name: '打开菜单' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '打开菜单' })).toBeFocused()
  await page.setViewportSize({ width: 320, height: 700 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('reduced motion, intro and page accessibility', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await expect(page.getByTestId('intro-screen')).toBeVisible()
  expect(
    await page
      .locator('.intro-orbit')
      .first()
      .evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none')
  const introAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(introAudit.violations).toEqual([])
  await expect(
    page.getByRole('heading', { name: '任逸轩', exact: true }),
  ).toBeVisible({ timeout: 8_000 })
  await expect(page.getByTestId('intro-screen')).toHaveCount(0)
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto')
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(audit.violations).toEqual([])
  await page.locator('#activities').scrollIntoViewIfNeeded()
  for (const image of await page.locator('img').all())
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({
    path: 'work/screenshots/home-desktop.png',
    fullPage: true,
  })
})

test('intro fits short landscape and its progress is visible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 568, height: 320 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const status = page.getByRole('status')
  await expect(status).toBeVisible()
  const bounds = await status.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.y).toBeGreaterThanOrEqual(0)
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(320)
  await expect(page.getByRole('progressbar')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({ path: 'work/screenshots/intro-landscape.png' })
})
