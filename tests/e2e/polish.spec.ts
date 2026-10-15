import { expect, test, type Page } from '@playwright/test'
import { presentFeedback, presentCompletion } from '../../src/features/learning/content/feedback-presentation'
import { useSessionStore } from '../../src/features/learning/model/session-store'
import { validateSession } from '../../src/features/learning/model/session-storage'

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
const input = (page: Page) => page.getByRole('textbox', { name: 'Message StudyFellow' })
const good = 'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.'
async function begin(page: Page) {
  await page.goto('/start'); await button(page, 'Try photosynthesis').click(); await button(page, 'Continue').click(); await button(page, 'Skip question').click(); await button(page, 'Begin session').click()
}
const answer = async (page: Page, text: string) => { await input(page).fill(text); await button(page, 'Send').click() }
const feedback = (page: Page) => page.getByRole('article', { name: 'Answer feedback' }).last()

test('home marketing stays general while available topic remains on setup', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Get help with a confusing idea, one clear step at a time.', { exact: true })).toBeVisible()
  await button(page, 'How it works').click()
  await expect(page.getByRole('main')).not.toContainText(/photosynthesis|light|materials|sugar/i)
  await page.getByRole('button', { name: 'Learn now' }).click()
  await expect(page.getByRole('main')).toContainText('Photosynthesis is the only topic available right now.')
})

test('positive guided and transfer feedback close a typed session without mastery claims', async ({ page }, info) => {
  await begin(page); await button(page, 'Continue').click(); await answer(page, 'Light provides energy to build sugar.')
  await expect(feedback(page).getByRole('heading', { name: 'Step complete' })).toBeVisible()
  await expect(feedback(page).locator('[data-feedback-tone]')).toHaveAttribute('data-feedback-tone', 'success')
  await expect(feedback(page)).toContainText('You explained how light energy helps the plant make sugar.')
  await button(page, 'Continue').click(); await answer(page, good)
  await expect(feedback(page).getByRole('heading', { name: 'Check complete' })).toBeVisible()
  await expect(feedback(page)).toContainText('You chose the right plant and explained how light helps it make sugar.')
  await button(page, 'View summary').click()
  const results = page.getByRole('region', { name: 'Session results' })
  await expect(results.getByRole('heading', { name: 'Session complete', exact: true })).toBeVisible()
  await expect(results.getByRole('heading', { name: 'Keep exploring (optional)' })).toBeVisible()
  await expect(results).toContainText('Which plant makes sugar faster · Clear'); await expect(results).toContainText('How light energy helps · Clear')
  await expect(results).not.toContainText(/mastered|mastery|passed|Your next step/i)
  await page.screenshot({ path: info.outputPath('polish-positive-recap.png') })
})

test('partial and uncertain answers stay neutral; successful retry gives positive closure', async ({ page }) => {
  await begin(page); await button(page, 'Continue').click(); await answer(page, 'Light provides energy to build sugar.'); await button(page, 'Continue').click()
  await answer(page, 'Plant A makes sugar faster.')
  await expect(feedback(page)).toContainText('One part is clear')
  await expect(feedback(page).locator('[data-feedback-tone]')).toHaveAttribute('data-feedback-tone', 'neutral')
  await expect(feedback(page)).toContainText('Add how less light energy affects sugar making.')
  await button(page, 'Continue').click(); await answer(page, 'I am not sure'); await button(page, 'Continue with help').click()
  await expect(feedback(page)).toContainText('Let’s make that clearer'); await expect(feedback(page).locator('[data-feedback-tone]')).toHaveAttribute('data-feedback-tone', 'neutral')
  await button(page, 'View summary').click(); await expect(page.getByRole('heading', { name: 'Session finished', exact: true })).toBeVisible()
  // A separate session has a genuinely sound retry, without changing the first result.
  page.once('dialog', dialog => dialog.accept()); await button(page, 'Reset').click()
  await button(page, 'Try photosynthesis').click(); await button(page, 'Continue').click(); await button(page, 'Skip question').click(); await button(page, 'Begin session').click(); await button(page, 'Continue').click()
  await answer(page, 'Light provides energy to build sugar.'); await button(page, 'Continue').click(); await answer(page, 'Plant A makes sugar faster.'); await button(page, 'Continue').click()
  await answer(page, 'Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.')
  await expect(feedback(page)).toContainText('You chose the right seedling'); await button(page, 'View summary').click()
  await expect(page.getByRole('heading', { name: 'Session complete', exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Session results' })).toContainText('How light energy helps · Needs another look')
  await expect(page.getByRole('region', { name: 'Session results' })).toContainText('Different situation')
})

test('sound transfer retains neutral closure when an earlier explanation is unresolved', async ({ page }) => {
  await begin(page); await button(page, 'Continue').click(); await answer(page, 'Light is food'); await button(page, 'Continue').click(); await button(page, 'Continue').click()
  await answer(page, 'I am not sure'); await button(page, 'Continue with help').click(); await button(page, 'Continue').click(); await button(page, 'Continue').click()
  await answer(page, good); await button(page, 'View summary').click()
  await expect(page.getByRole('heading', { name: 'Session finished', exact: true })).toBeVisible()
  await expect(page.getByText('The final plant comparison is complete. One earlier explanation still needs attention.', { exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Remaining uncertainty' })).toBeVisible()
  await expect(button(page, 'Review energy and materials')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Session results' }).locator('[data-feedback-tone]')).toHaveAttribute('data-feedback-tone', 'neutral')
})

test('display adapters preserve saved feedback bytes and respect example and uncertain origins', () => {
  const data = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) } })
  const store = () => useSessionStore.getState()
  store().reset(); store().begin({ topic: 'photosynthesis', confusion: '', diagnostic: 'skipped', correction: '', energy: false }); store().move(1)
  store().useExample('ready', 'ready-turn-09'); store().check(); store().move(1); store().setDraft(good); store().check(); store().move(1)
  const before = JSON.stringify(store().session), session = JSON.parse(before)
  expect(presentFeedback(session.attempts[0])).toMatchObject({ title: 'Step complete', tone: 'success', text: 'This example answer explains how light energy helps the plant make sugar.' })
  expect(presentCompletion(session).title).toBe('Session complete')
  for (const attempt of session.attempts) presentFeedback(attempt)
  expect(JSON.stringify(session)).toBe(before); expect(JSON.stringify(store().session)).toBe(before)
  const restored = validateSession(JSON.parse(before))!
  expect(restored).not.toBeNull(); expect(JSON.stringify(restored)).toBe(before)
  const uncertain = structuredClone(session.attempts[1]); uncertain.assessment.uncertain = true
  expect(presentFeedback(uncertain)).toMatchObject({ title: 'Let’s make that clearer', tone: 'neutral' })
  store().reset()
})

for (const motion of ['no-preference', 'reduce'] as const) {
  test(`${motion} motion is observable once and does not replay on draft edits, Back or resume`, async ({ page }, info) => {
    await page.setViewportSize({ width: 320, height: 500 }); await page.emulateMedia({ reducedMotion: motion })
    await page.addInitScript(() => {
      const original = Element.prototype.animate
      const records: { target: string; duration: number; delay: number; running: boolean; transform: boolean }[] = []
      Object.defineProperty(window, 'presentationAnimations', { value: records })
      Element.prototype.animate = function (keyframes, options) {
        const animation = original.call(this, keyframes, options)
        const timing = animation.effect!.getTiming(), frames = animation.effect!.getKeyframes()
        records.push({ target: this.getAttribute('data-turn-id') ? 'turn' : this.getAttribute('data-route-entry') ? 'route' : this.hasAttribute('data-completion-cue') ? 'completion' : this.classList.contains('session-block') ? 'block' : this.tagName, duration: Number(timing.duration), delay: timing.delay, running: animation.playState === 'running', transform: frames.some(frame => frame.transform !== undefined) })
        return animation
      }
    })
    const records = () => page.evaluate(() => (window as unknown as { presentationAnimations: { target: string; duration: number; delay: number; running: boolean; transform: boolean }[] }).presentationAnimations)
    await begin(page)
    const initial = await records()
    if (motion === 'reduce') expect(initial).toEqual([])
    else { expect(initial.length).toBeGreaterThan(0); expect(initial.every(item => item.running && item.duration === 180 && item.delay <= 140 && item.transform)).toBe(true) }
    const start = initial.length
    await button(page, 'Continue').click(); await expect(page.getByRole('heading', { name: 'Your turn' })).toBeFocused()
    const forward = await records()
    if (motion === 'reduce') expect(forward).toEqual([])
    else expect(forward.slice(start).some(item => item.target === 'block' && item.running && item.duration === 180 && item.transform)).toBe(true)
    await input(page).fill('Light provides energy to build sugar.')
    expect((await records()).length).toBe(forward.length)
    await button(page, 'Back').click(); await button(page, 'Continue').click()
    await expect(input(page)).toHaveValue('Light provides energy to build sugar.')
    expect((await records()).length).toBe(forward.length)
    await button(page, 'Send').click(); await expect(input(page)).toBeFocused()
    await expect(feedback(page)).toContainText('Step complete')
    const answered = await records()
    if (motion === 'reduce') expect(answered).toEqual([])
    else { expect(answered.some(item => item.target === 'turn' && item.duration === 160 && item.running)).toBe(true); expect(answered.some(item => item.target === 'DIV' && item.duration === 180 && !item.transform)).toBe(true) }
    await button(page, 'Continue').click(); await answer(page, good); await button(page, 'View summary').click()
    await expect(page.getByRole('heading', { name: 'Session complete', exact: true })).toBeVisible()
    const completed = await records()
    if (motion === 'reduce') expect(completed).toEqual([])
    else expect(completed.some(item => item.target === 'completion' && item.duration === 180 && item.running)).toBe(true)
    const canvas = (await page.locator('.session-canvas').boundingBox())!, dock = (await page.locator('.session-dock').boundingBox())!
    expect(canvas.height).toBeGreaterThanOrEqual(90); expect(canvas.y + canvas.height).toBeLessThanOrEqual(dock.y + 1); expect(dock.y + dock.height).toBeLessThanOrEqual(501)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    await page.screenshot({ path: info.outputPath(`polish-${motion}-short-phone-success.png`) })
    await button(page, 'Back').click(); await button(page, 'View summary').click(); expect((await records()).length).toBe(completed.length)
    await button(page, 'Leave').click(); await button(page, 'View saved summary').click(); expect((await records()).length).toBe(completed.length)
    await page.reload(); expect(await records()).toEqual([])
    await expect(page.getByRole('heading', { name: 'Session complete', exact: true })).toBeVisible()
  })
}

test('missing Web Animations API keeps static teaching and success usable', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => { Object.defineProperty(Element.prototype, 'animate', { configurable: true, value: undefined }) })
  await begin(page); await button(page, 'Continue').click(); await answer(page, 'Light provides energy to build sugar.')
  await expect(feedback(page)).toContainText('Step complete')
  await expect(page.getByRole('heading', { name: 'Your turn' })).toBeVisible()
  expect(errors).toEqual([])
})
