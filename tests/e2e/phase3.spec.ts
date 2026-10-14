import { expect, test } from '@playwright/test'
import { unresolvedExplanation, useSessionStore } from '../../src/features/learning/model/session-store'
import { validateSession } from '../../src/features/learning/model/session-storage'
const store = () => useSessionStore.getState()
function fresh() {
  const data = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) } })
  store().reset(); store().begin({ topic: 'photosynthesis', confusion: '', diagnostic: 'skipped', correction: '', energy: false })
}
const clone = () => JSON.parse(JSON.stringify(store().session))
const valid = () => expect(validateSession(clone())).not.toBeNull()
const check = (text: string) => { store().setDraft(text); store().check(); valid() }
const move = () => { store().move(1); valid() }
const good = 'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.'

test('v2 rebuilds criteria and rejects forged feedback, unreachable frontier and chronological evidence', () => {
  fresh(); valid(); move(); check('Light provides energy to build sugar.'); move(); check(good)
  const correct = clone(); expect(validateSession(correct)?.attempts[1].assessment).toMatchObject({ score: 2 })
  const changedScore = clone(); changedScore.attempts[1].assessment.score = 0; expect(validateSession(changedScore)?.attempts[1].assessment).toMatchObject({ score: 2 })
  const feedback = clone(); feedback.attempts[1].feedback = 'You have mastered photosynthesis'; feedback.turns[3].text = feedback.attempts[1].feedback; expect(validateSession(feedback)).toBeNull()
  const pending = clone(); pending.route.forEach((entry: { status: string }) => { if (entry.status !== 'skipped') entry.status = 'pending' }); pending.currentStepId = 'core'; expect(validateSession(pending)).toBeNull()
  const order = clone(); order.turns = [...order.turns.slice(2), ...order.turns.slice(0, 2)].map((turn: Record<string, unknown>, i: number) => ({ ...turn, id: i + 1 })); expect(validateSession(order)).toBeNull()
  const date = clone(); date.attempts[1].at = '2000-01-01T00:00:00.000Z'; expect(validateSession(date)).toBeNull()
  const origin = clone(); origin.turns[2].origin = 'example'; expect(validateSession(origin)).toBeNull()
  move(); expect(store().session!.completed).toBe(true); store().review('core'); valid(); store().review('recap'); valid()
})

test('v2 permits real added support, uncertain help context, retry and completed back navigation', () => {
  fresh(); move(); check('Light is food'); move(); move(); store().setDraft('unknown'); store().check(); valid(); store().help(true); valid(); store().help(false); store().check(true); valid(); move(); move(); check('Plant A makes sugar faster.'); move(); check('Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.'); move()
  const attempts = store().session!.attempts; store().move(-1); valid(); store().check(); expect(store().session!.attempts).toBe(attempts); store().move(-1); valid()
  const duplicate = clone(); duplicate.route.push(duplicate.route[0]); expect(validateSession(duplicate)).toBeNull()
  const unsupported = clone(); unsupported.scenarioVersion = 999; expect(validateSession(unsupported)).toBeNull()
  const seeds = clone(); seeds.usedSeeds = ['invented']; expect(validateSession(seeds)).toBeNull()
})

test('edited example origin, answer draft and clarification remain exact after reload', async ({ page }, info) => {
  await page.goto('/start'); await page.getByRole('button', { name: 'Try photosynthesis' }).click(); await page.getByRole('button', { name: 'Skip question' }).click(); await page.getByRole('button', { name: 'Begin session' }).click()
  const examples = page.locator('.session-canvas details').first(); await examples.locator('summary').click(); page.once('dialog', dialog => dialog.accept()); await examples.getByRole('button', { name: 'Ready', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click(); await examples.getByRole('button', { name: 'Use example answer' }).click(); const input = page.getByRole('textbox', { name: 'Message StudyFellow' }); await input.fill('Light provides energy to build sugar.'); await page.getByRole('button', { name: 'Check answer' }).click(); await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await examples.getByRole('button', { name: 'Use example answer' }).click(); await input.fill('Plant A makes sugar faster because it has less light energy to build sugar.'); await page.getByRole('button', { name: 'Check answer' }).click(); await page.getByRole('button', { name: 'Need help?' }).click(); await page.reload(); await expect(page.getByRole('button', { name: 'Return to answer' })).toBeVisible(); await page.getByRole('button', { name: 'Return to answer' }).click(); await expect(input).toHaveValue('Plant A makes sugar faster because it has less light energy to build sugar.')
  await input.fill(good); await page.getByRole('button', { name: 'Check answer' }).click(); await page.getByRole('button', { name: 'View summary' }).click(); await expect(examples).not.toHaveAttribute('open'); await page.reload(); await expect(page.getByRole('region', { name: 'Session results' })).toContainText('Example answer · edited · shows the check, not your understanding'); await expect(input).not.toBeVisible(); await page.screenshot({ path: info.outputPath('phase3-edited-recap.png') })
})

test('home describes working checks in simple language', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('complementary')).toContainText('Check your answers and get feedback on each part.')
  await expect(page.getByRole('main')).not.toContainText(/won’t be checked|not checked yet|lost if you reload/i)
})

test('save failure and unclear answer retain short-phone reading space and recovery action', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 500 }); await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Unavailable') } })
  await page.goto('/start'); await page.getByRole('button', { name: 'Try photosynthesis' }).click(); await page.getByRole('button', { name: 'Skip question' }).click(); await page.getByRole('button', { name: 'Begin session' }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click(); await page.getByRole('textbox', { name: 'Message StudyFellow' }).fill('A strange sky\n'.repeat(7)); await page.getByRole('button', { name: 'Check answer' }).click(); await page.locator('.session-route-mobile > summary').click()
  const canvas = (await page.locator('.session-canvas').boundingBox())!, dock = (await page.locator('.session-dock').boundingBox())!
  expect(canvas.height).toBeGreaterThanOrEqual(90); expect(canvas.y + canvas.height).toBeLessThanOrEqual(dock.y + 1); expect(dock.y + dock.height).toBeLessThanOrEqual(501)
  await expect(page.getByRole('button', { name: 'Retry saving' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Continue with help' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  await page.screenshot({ path: info.outputPath('phase3-320-save-failure.png') })
})

test('recap names the remaining energy connection when matter inputs were stated', () => {
  fresh(); move(); check('Light is food'); move(); move(); check('Light provides energy. Water and carbon dioxide are materials.')
  expect(unresolvedExplanation(store().session!)?.text).toBe('How captured light energy supports sugar building is still unclear in this answer.')
})
