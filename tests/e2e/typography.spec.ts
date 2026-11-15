import { test, expect, type Locator, type Page } from '@playwright/test'

const viewports = [
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
]

async function expectFontSize(locator: Locator, min: number, max: number) {
  const size = await locator.evaluate((node) =>
    parseFloat(getComputedStyle(node).fontSize),
  )
  expect(size, `Font size for ${locator}`).toBeGreaterThanOrEqual(min - 0.1)
  expect(size, `Font size for ${locator}`).toBeLessThanOrEqual(max + 0.1)
  return size
}

async function expectSeparated(first: Locator, second: Locator) {
  const a = await first.boundingBox()
  const b = await second.boundingBox()
  expect(a, `${first} must have a rendered box`).not.toBeNull()
  expect(b, `${second} must have a rendered box`).not.toBeNull()
  const intersectionWidth =
    Math.min(a!.x + a!.width, b!.x + b!.width) - Math.max(a!.x, b!.x)
  const intersectionHeight =
    Math.min(a!.y + a!.height, b!.y + b!.height) - Math.max(a!.y, b!.y)
  expect(
    intersectionWidth <= 1 || intersectionHeight <= 1,
    `${first} overlaps ${second}`,
  ).toBe(true)
}

/** Check actual rendered text ranges, including wrapped lines, instead of only parent boxes. */
async function expectTextWithinViewport(
  page: Page,
  selector: string,
  checkVertical = false,
) {
  const overflow = await page
    .locator(selector)
    .evaluateAll((roots, vertical) => {
      const problems: string[] = []
      for (const root of roots) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        let node: Node | null
        while ((node = walker.nextNode())) {
          if (!node.textContent?.trim()) continue
          const parent = node.parentElement
          if (!parent || parent.closest('[aria-hidden="true"], .skip-link'))
            continue
          const style = getComputedStyle(parent)
          if (style.visibility === 'hidden' || style.display === 'none')
            continue
          const range = document.createRange()
          range.selectNodeContents(node)
          for (const rect of range.getClientRects()) {
            if (!rect.width || !rect.height) continue
            if (
              rect.left < -1 ||
              rect.right > innerWidth + 1 ||
              (vertical && (rect.top < -1 || rect.bottom > innerHeight + 1))
            ) {
              problems.push(
                `${node.textContent.trim().slice(0, 45)}: ${Math.round(rect.left)},${Math.round(rect.top)}—${Math.round(rect.right)},${Math.round(rect.bottom)}`,
              )
            }
          }
        }
      }
      return problems
    }, checkVertical)
  expect(
    overflow,
    'Visible text must fit the viewport without being cut off',
  ).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
}

for (const viewport of viewports) {
  test(`readable typography and layout at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    // Freeze only these layout checks; site.spec.ts independently tests real five-second timing.
    const time = new Date('2026-01-01T00:00:00Z')
    await page.clock.install({ time })
    await page.clock.pauseAt(new Date(time.getTime() + 1_000))
    await page.goto('./')
    await expect(page.getByTestId('intro-screen')).toBeVisible()
    await expect
      .poll(() =>
        page
          .locator('.intro-emblem')
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true)

    const mobile = viewport.width <= 640
    const desktop = viewport.width >= 1000
    const sizes: Record<string, number> = {}
    sizes.introHeading = await expectFontSize(
      page.locator('#intro-title'),
      mobile ? 30 : desktop ? 48 : 30,
      mobile ? 38 : 64,
    )
    sizes.introEnglish = await expectFontSize(
      page.locator('.intro-subtitle'),
      mobile ? 14 : desktop ? 18 : 14,
      mobile ? 17 : 22,
    )
    sizes.introWelcome = await expectFontSize(
      page.locator('.intro-welcome'),
      mobile ? 22 : desktop ? 28 : 22,
      mobile ? 28 : 36,
    )
    expect(
      await page
        .locator('#intro-title')
        .evaluate((node) => Number(getComputedStyle(node).fontWeight)),
    ).toBeGreaterThanOrEqual(700)
    await expectTextWithinViewport(page, '.intro-screen', true)
    const introBlocks = [
      '.intro-emblem-wrap',
      '#intro-title',
      '.intro-subtitle',
      '.intro-welcome',
      '.intro-loading',
    ]
    for (let i = 0; i < introBlocks.length; i++) {
      for (let j = i + 1; j < introBlocks.length; j++) {
        await expectSeparated(
          page.locator(introBlocks[i]),
          page.locator(introBlocks[j]),
        )
      }
    }
    await page.screenshot({
      path: `work/screenshots/typography-intro-${viewport.width}.png`,
    })

    await page.clock.runFor(5_100)
    await expect(page.getByTestId('intro-screen')).toHaveCount(0)
    await expect(page.locator('#sponsor-name')).toHaveText('任逸轩')
    sizes.sponsorName = await expectFontSize(
      page.locator('#sponsor-name'),
      mobile ? 36 : desktop ? 56 : 36,
      mobile ? 44 : 72,
    )
    sizes.heroTitle = await expectFontSize(
      page.locator('.hero-statement'),
      mobile ? 30 : 40,
      mobile ? 36 : 52,
    )
    sizes.heroSubtitle = await expectFontSize(
      page.locator('.hero-role'),
      mobile ? 18 : 22,
      mobile ? 21 : 26,
    )
    sizes.profileBody = await expectFontSize(
      page.locator('.profile-copy > p').first(),
      mobile ? 17 : desktop ? 19 : 17,
      mobile ? 19 : 22,
    )
    sizes.footer = await expectFontSize(page.locator('.footer-bottom'), 12, 13)
    const profileLineHeight = await page
      .locator('.profile-copy > p')
      .first()
      .evaluate((node) => {
        const style = getComputedStyle(node)
        return parseFloat(style.lineHeight) / parseFloat(style.fontSize)
      })
    expect(profileLineHeight).toBeGreaterThanOrEqual(1.69)
    expect(profileLineHeight).toBeLessThanOrEqual(1.91)
    await expectTextWithinViewport(page, 'header, main, footer')
    await expectSeparated(
      page.locator('.hero-copy'),
      page.locator('.portrait-frame'),
    )
    await expectSeparated(
      page.locator('.portrait-caption'),
      page.locator('.portrait-note'),
    )
    await expectSeparated(
      page.locator('.profile-mark'),
      page.locator('.profile-copy'),
    )
    for (const card of await page.locator('.activity-card').all()) {
      await expectSeparated(
        card.locator('.activity-image-wrap'),
        card.locator('.activity-body'),
      )
    }
    const navItems = page.locator(
      '.brand, .desktop-links:visible, .nav-thanks, .menu-toggle:visible',
    )
    for (let i = 0; i < (await navItems.count()) - 1; i++) {
      await expectSeparated(navItems.nth(i), navItems.nth(i + 1))
    }
    if (await page.locator('.menu-toggle').isVisible()) {
      await page.getByRole('button', { name: '打开菜单' }).click()
      await expectTextWithinViewport(page, '#mobile-menu')
      await page.keyboard.press('Escape')
      await expect(page.locator('#mobile-menu')).toHaveCount(0)
    }
    for (const section of await page.locator('main > section').all()) {
      await section.scrollIntoViewIfNeeded()
      await expectTextWithinViewport(page, 'main')
    }
    for (const image of await page.locator('img').all()) {
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true)
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({
      path: `work/screenshots/typography-home-${viewport.width}.png`,
      fullPage: true,
    })
    console.log(`Typography at ${viewport.width}px: ${JSON.stringify(sizes)}`)
  })
}
