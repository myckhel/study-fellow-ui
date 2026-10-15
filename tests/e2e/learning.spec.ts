import { expect, test, type Page } from '@playwright/test'
// The old goal/file/time and optional-practice screens are retired. Carry their
// interruption, evidence, recovery, keyboard and offline guarantees into v2.
const key = 'studyfellow.session.v2'
const good = 'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.'
const retryGood = 'Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.'
const input = (page: Page) => page.getByRole('textbox', { name: 'Message StudyFellow' })
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
async function setup(page: Page) {
  await page.goto('/start'); await button(page, 'Try photosynthesis').click(); await button(page, 'Continue').click(); await button(page, 'Skip question').click(); await button(page, 'Begin session').click()
}
async function transfer(page: Page) {
  await setup(page); await button(page, 'Continue').click(); await input(page).fill('Light provides energy to build sugar.'); await button(page, 'Send').click(); await button(page, 'Continue').click()
}
async function saved(page: Page) { return page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key) }
async function exactReload(page: Page) {
  await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Saved on this browser')
  const before = await saved(page); await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toBeVisible(); expect(await saved(page)).toEqual(before)
}

test('first and retry evidence stays distinct through recap, revisit, reload and home', async ({ page }, info) => {
  await transfer(page); await input(page).fill('Plant A makes sugar faster.'); await button(page, 'Send').click()
  await exactReload(page); await button(page, 'Continue').click(); await expect(page.getByRole('heading', { name: 'A different situation' })).toBeFocused()
  await input(page).fill(retryGood); await button(page, 'Send').click(); await button(page, 'View summary').click()
  const result = page.getByRole('region', { name: 'Session results' }); await expect(result).toContainText('First situation'); await expect(result).toContainText('Different situation')
  const before = await saved(page); expect(before.attempts.map((a: { assessment: { score?: number } }) => a.assessment.score)).toEqual([undefined, 1, 2])
  await exactReload(page); await button(page, 'Back').click(); await input(page).fill('Another question'); await button(page, 'Send').click()
  expect((await saved(page)).attempts).toEqual(before.attempts)
  await button(page, 'View summary').click(); await page.screenshot({ path: info.outputPath('phase3-recap.png') })
  await button(page, 'Return home').click(); await expect(button(page, 'View saved summary')).toBeVisible(); await button(page, 'View saved summary').click(); await expect(page.getByRole('heading', { name: 'What we covered' })).toBeFocused()
})

test('unknown and contradictory transfer drafts clarify; unresolved retry completes without success', async ({ page }, info) => {
  await transfer(page)
  for (const answer of ['banana', 'Plant A makes sugar faster because it has less light energy to build sugar.']) {
    await input(page).fill(answer); await button(page, 'Send').click(); await expect(button(page, 'Continue with help')).toBeVisible(); expect((await saved(page)).attempts).toHaveLength(1)
    await exactReload(page); await expect(input(page)).toHaveValue(answer); await button(page, 'Keep working').click()
  }
  await button(page, 'Send').click(); await button(page, 'Continue with help').click(); await button(page, 'Continue').click(); await input(page).fill('I am not sure'); await button(page, 'Send').click(); await button(page, 'Continue with help').click(); await button(page, 'View summary').click()
  await expect(page.getByRole('region', { name: 'Session results' })).toContainText('Some wording remains unclear')
  await page.screenshot({ path: info.outputPath('phase3-unresolved.png') })
  const attempts = (await saved(page)).attempts; await button(page, 'Review how light helps').click(); await expect(page.getByRole('heading', { name: 'How light helps' })).toBeFocused(); await exactReload(page)
  await button(page, 'Leave').click(); await button(page, 'View saved summary').click(); await expect(page.getByRole('heading', { name: 'What we covered' })).toBeFocused(); expect((await saved(page)).attempts).toEqual(attempts)
})

test('separate answer/help drafts and added route survive interruption and pending-draft Leave', async ({ page }) => {
  await setup(page); await input(page).fill('Does light turn into sugar?'); await button(page, 'Send').click(); await exactReload(page)
  await button(page, 'Continue').click(); await input(page).fill('Light is food'); await button(page, 'Need help?').click(); await input(page).fill('help draft'); await exactReload(page); await expect(input(page)).toHaveValue('help draft')
  await button(page, 'Return to answer').click(); await expect(input(page)).toHaveValue('Light is food'); await button(page, 'Send').click(); await exactReload(page)
  await button(page, 'Continue').click(); await exactReload(page); await button(page, 'Continue').click(); await input(page).fill('unfinished follow-up'); await button(page, 'Leave').click(); await expect(page).toHaveURL('/'); await page.reload()
  await expect(page.getByText('Next: Apply the idea and check your answer')).toBeVisible(); await button(page, 'Continue session').click(); await expect(input(page)).toHaveValue('unfinished follow-up')
})

for (const [label, raw] of [['corrupt JSON', '{broken'], ['unknown schema', JSON.stringify({ schemaVersion: 999 })], ['unknown scenario', JSON.stringify({ schemaVersion: 2, scenarioVersion: 999 })]]) {
  test(`saved ${label} needs confirmed recovery and preserves cancellation`, async ({ page }, info) => {
    // Install before the app boots; a live app correctly flushes on pagehide.
    await page.addInitScript(([k, value]) => localStorage.setItem(k, value), [key, raw])
    await page.goto('/')
    await expect(page.getByRole('status', { name: 'Save status' })).toContainText('saved session can’t be opened')
    page.once('dialog', dialog => dialog.dismiss()); await button(page, 'Clear saved progress').click(); expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe(raw)
    await page.screenshot({ path: info.outputPath('phase3-recovery.png') })
    page.once('dialog', dialog => dialog.accept()); await button(page, 'Clear saved progress').click(); expect(await page.evaluate(k => localStorage.getItem(k), key)).toBeNull()
  })
}

test('clean read-success/write-denied storage still permits in-tab learning and retry', async ({ page }, info) => {
  await page.addInitScript(() => {
    const write = Storage.prototype.setItem
    Object.defineProperty(window, 'enableSaving', { value: () => { Storage.prototype.setItem = write } })
    Storage.prototype.setItem = () => { throw new DOMException('Unavailable') }
    Storage.prototype.removeItem = () => { throw new DOMException('Unavailable') }
  })
  await setup(page); await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Progress isn’t saved'); await input(page).fill('draft despite failure'); await button(page, 'Leave').click(); await button(page, 'Continue session').click(); await expect(input(page)).toHaveValue('draft despite failure')
  await page.screenshot({ path: info.outputPath('phase3-save-failure.png') })
  await page.evaluate(() => (window as unknown as { enableSaving: () => void }).enableSaving()); await button(page, 'Retry saving').click(); await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Saved on this browser'); expect((await saved(page)).drafts.core.text).toBe('draft despite failure')
})

test('denied storage reads allow learning; failed removal retains session and saved bytes', async ({ page }) => {
  await setup(page); const before = await saved(page)
  await page.evaluate(() => { Storage.prototype.removeItem = () => { throw new DOMException('Unavailable') } })
  page.once('dialog', dialog => dialog.accept()); await button(page, 'Reset').click(); await expect(page.getByRole('heading', { name: 'How light helps' })).toBeVisible(); expect(await saved(page)).toEqual(before); await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Progress isn’t saved')
  await page.addInitScript(() => { Storage.prototype.getItem = () => { throw new DOMException('Unavailable') }; Storage.prototype.setItem = () => { throw new DOMException('Unavailable') } })
  await page.goto('/start'); await button(page, 'Try photosynthesis').click(); await button(page, 'Continue').click(); await button(page, 'Skip question').click(); await button(page, 'Begin session').click(); await expect(page.getByRole('heading', { name: 'How light helps' })).toBeVisible(); await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Progress isn’t saved')
})

test('unknown routes and failed current lazy import recover', async ({ page }) => {
  await page.goto('/missing-page'); await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible(); await page.getByRole('link', { name: 'Return home' }).click(); await expect(page.getByRole('button', { name: 'Learn now' })).toBeVisible()
  test.skip(!!process.env.PLAYWRIGHT_PRODUCTION, 'Dev import interception only')
  await page.route('**/src/features/learning/routes/start-route.tsx*', route => route.abort()); await page.goto('/start'); await expect(page.getByRole('heading', { name: 'We couldn’t open this page' })).toBeVisible(); await page.unroute('**/src/features/learning/routes/start-route.tsx*'); await button(page, 'Reload page').click(); await expect(page.getByRole('heading', { name: 'What feels confusing?' })).toBeVisible()
})

test('keyboard handoff and short phone recap retain focus and reading space', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 500 }); await page.emulateMedia({ reducedMotion: 'reduce' }); await setup(page); await button(page, 'Continue').focus(); await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { name: 'Your turn' })).toBeFocused()
  await input(page).fill('Light provides energy to build sugar.'); await button(page, 'Send').focus(); await page.keyboard.press('Enter'); await button(page, 'Continue').click(); await input(page).fill(good); await button(page, 'Send').click(); await button(page, 'View summary').click()
  await expect(input(page)).not.toBeVisible(); const canvas = (await page.locator('.session-canvas').boundingBox())!; const dock = (await page.locator('.session-dock').boundingBox())!; expect(canvas.height).toBeGreaterThan(200); expect(canvas.y + canvas.height).toBeLessThanOrEqual(dock.y + 1); expect(dock.y + dock.height).toBeLessThanOrEqual(501)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320); await page.screenshot({ path: info.outputPath('phase3-320-recap.png') })
})

test('production cached revisit works offline with new saved transfer drafts', async ({ page, context }) => {
  test.skip(!process.env.PLAYWRIGHT_PRODUCTION, 'Requires production service worker')
  await transfer(page); await input(page).fill('Plant A makes sugar faster.'); await button(page, 'Leave').click(); await page.evaluate(async () => { await navigator.serviceWorker.ready }); await page.reload(); await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true); await page.reload(); await button(page, 'Continue session').click(); await expect(input(page)).toHaveValue('Plant A makes sugar faster.'); await input(page).fill(good); await button(page, 'Send').click(); await button(page, 'View summary').click(); await expect(page.getByRole('region', { name: 'Session results' })).toContainText('How light energy helps · Clear')
})

test('unsaved completion offers an in-tab summary without claiming it is saved', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Unavailable') } })
  await transfer(page); await input(page).fill(good); await button(page, 'Send').click(); await button(page, 'View summary').click(); await button(page, 'Return home').click()
  await expect(page.getByRole('status', { name: 'Save status' })).toContainText('Progress isn’t saved')
  await expect(button(page, 'View saved summary')).not.toBeVisible(); await button(page, 'View summary').click(); await expect(page.getByRole('heading', { name: 'What we covered' })).toBeVisible()
})

for (const resolved of [false, true]) {
  test(`recap ${resolved ? 'clears corrected' : 'retains unresolved'} matter explanation independently of correct transfer`, async ({ page }, info) => {
    await setup(page); await button(page, 'Continue').click(); await input(page).fill('Light is food'); await button(page, 'Send').click(); await button(page, 'Continue').click(); await button(page, 'Continue').click()
    await input(page).fill(resolved ? 'Light provides energy to build sugar. Water and carbon dioxide are materials.' : 'I am not sure'); await button(page, 'Send').click()
    if (!resolved) await button(page, 'Continue with help').click()
    await button(page, 'Continue').click(); await button(page, 'Continue').click(); await input(page).fill(good); await button(page, 'Send').click(); await button(page, 'View summary').click(); await exactReload(page)
    const uncertainty = page.getByRole('region', { name: 'Remaining uncertainty' })
    if (resolved) { await expect(uncertainty).not.toBeVisible(); await expect(button(page, 'Review energy and materials')).not.toBeVisible() }
    else { await expect(uncertainty).toContainText('difference between light energy and materials is still unclear'); await button(page, 'Review energy and materials').click(); await expect(page.getByRole('heading', { name: 'Energy and materials' })).toBeFocused(); await exactReload(page); await button(page, 'Leave').click(); await button(page, 'View saved summary').click(); await expect(uncertainty).toBeVisible() }
    await page.screenshot({ path: info.outputPath(`phase3-matter-${resolved ? 'resolved' : 'unresolved'}.png`) })
  })
}
