import { expect, test, type Page } from '@playwright/test'
import { scenario } from '../../src/features/learning/content/session-scenario'
import { useSessionStore } from '../../src/features/learning/model/session-store'
import { validateSession } from '../../src/features/learning/model/session-storage'

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
const input = (page: Page) => page.getByRole('textbox', { name: 'Message StudyFellow' })
const saved = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('studyfellow.session.v2')!))
async function begin(page: Page) {
  await page.goto('/start'); await button(page, 'Try photosynthesis').click(); await button(page, 'Continue').click(); await button(page, 'Skip question').click(); await button(page, 'Begin session').click()
}
async function words(page: Page) {
  const details = page.locator('.session-canvas details').filter({ has: page.locator('summary', { hasText: 'Example words' }) })
  if (!await details.evaluate(node => node.hasAttribute('open'))) await details.locator('summary').click()
  return details
}

test('home describes a neutral journey and prefill waits for explicit continuation', async ({ page }) => {
  await page.goto('/')
  const overview = page.getByRole('complementary')
  await expect(overview.getByRole('heading', { name: 'A clear way forward' })).toBeVisible()
  for (const name of ['Bring a confusing idea', 'Work through it', 'Try what you’ve learned']) await expect(overview.getByRole('heading', { name })).toBeVisible()
  await expect(overview.locator('figure')).toHaveCount(0)
  await expect(button(page, 'Continue session')).not.toBeVisible()
  await page.getByRole('button', { name: 'Learn now' }).click()
  await button(page, 'Try photosynthesis').click()
  await expect(page.getByRole('textbox', { name: 'Topic or question' })).toHaveValue('Photosynthesis')
  await expect(page.getByRole('textbox', { name: 'Topic or question' })).toBeFocused()
  await expect(page.getByRole('textbox', { name: 'What’s confusing? (optional)' })).toHaveValue(scenario.initialLearnerInput)
  await expect(page.getByRole('heading', { name: 'What feels confusing?' })).toBeVisible()
  expect(await saved(page)).toBeNull()
  await button(page, 'Continue').click()
  await expect(page.getByRole('heading', { name: 'Which supplies materials for making sugar?' })).toBeVisible()
  const names = ['Water and carbon dioxide supply materials.', 'Water, carbon dioxide and light all supply materials.', 'I’m not sure yet.']
  const bounds = []
  for (const name of names) {
    const choice = button(page, name)
    const rect = (await choice.boundingBox())!
    bounds.push(rect)
    expect(rect.height).toBeGreaterThanOrEqual(44)
    expect(await choice.evaluate(node => getComputedStyle(node).textAlign)).toBe('left')
  }
  expect(bounds[0].width).toBe(bounds[1].width)
  expect(bounds[1].width).toBe(bounds[2].width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width)
  await button(page, names[1]).click()
  await expect(page.getByRole('heading', { name: 'Understand energy and materials in photosynthesis' })).toBeVisible()
})

test('prefill cancellation preserves typed fields and confirmation preserves confusion', async ({ page }) => {
  await page.goto('/start')
  const topic = page.getByRole('textbox', { name: 'Topic or question' }), confusion = page.getByRole('textbox', { name: 'What’s confusing? (optional)' })
  await topic.fill('Calculus'); await confusion.fill('Why do slopes change?')
  page.once('dialog', dialog => dialog.dismiss()); await button(page, 'Try photosynthesis').click()
  await expect(topic).toHaveValue('Calculus'); await expect(confusion).toHaveValue('Why do slopes change?')
  expect(await saved(page)).toBeNull()
  page.once('dialog', dialog => dialog.accept()); await button(page, 'Try photosynthesis').click()
  await expect(topic).toHaveValue('Photosynthesis'); await expect(confusion).toHaveValue('Why do slopes change?'); await expect(topic).toBeFocused()
  await button(page, 'Try photosynthesis').click(); await expect(confusion).toHaveValue('Why do slopes change?')
})

test('ordinary-session example words preserve mixed origins and both drafts through reload', async ({ page }) => {
  await begin(page); await button(page, 'Continue').click(); const exampleWords = await words(page)
  const original = await saved(page)
  await exampleWords.getByRole('button', { name: 'Misconception answer', exact: true }).click()
  await expect(input(page)).toHaveValue('Sunlight becomes food'); await expect(input(page)).toBeFocused()
  page.once('dialog', dialog => dialog.dismiss()); await exampleWords.getByRole('button', { name: 'Complete answer', exact: true }).click()
  await expect(input(page)).toHaveValue('Sunlight becomes food')
  await exampleWords.getByRole('button', { name: 'Clarification question', exact: true }).click()
  await expect(input(page)).toHaveValue('Does light turn into sugar?')
  await expect(page.locator('.session-dock').getByText('Example message', { exact: true })).toBeVisible()
  await button(page, 'Send').click()
  await expect(page.getByRole('region', { name: 'Messages at this step' }).getByText('Example message', { exact: true })).toBeVisible()
  await button(page, 'Return to answer').click(); await expect(input(page)).toHaveValue('Sunlight becomes food')
  await button(page, 'Leave').click(); await button(page, 'Continue session').click(); await page.reload()
  const before = await saved(page)
  expect(before.id).toBe(original.id); expect(before.route).toEqual(original.route); expect(before.routeChanges).toEqual([]); expect(before.attempts).toEqual([]); expect(before.examplePath).toBeNull()
  expect(before.answerDrafts.guided).toMatchObject({ origin: 'example', pathId: 'misconception', text: 'Sunlight becomes food' })
  expect(before.turns[0]).toMatchObject({ origin: 'example', pathId: 'clarification', text: 'Does light turn into sugar?' })
  await expect(input(page)).toHaveValue('Sunlight becomes food')
  await expect(page.locator('.session-dock').getByText('Example answer', { exact: true })).toBeVisible()
  await button(page, 'Send').click()
  await expect(page.getByRole('article', { name: 'Answer feedback' })).toContainText('Route changed:')
  await expect(page.getByRole('region', { name: 'Messages at this step' }).getByText('Example answer', { exact: true })).toBeVisible()
  const checked = await saved(page)
  expect(checked.attempts).toHaveLength(1); expect(checked.currentStepId).toBe('guided')
  // Completed answer stays immutable; a question example remains useful after checking.
  await words(page); await button(page, 'Clarification question').click(); await expect(input(page)).toHaveValue('Does light turn into sugar?'); await button(page, 'Send').click()
  expect((await saved(page)).attempts).toEqual(checked.attempts)
  await page.reload(); expect((await saved(page)).attempts).toEqual(checked.attempts)
})

test('Send checks answer mode once and Help Send remains conversational', async ({ page }) => {
  await begin(page); await button(page, 'Continue').click()
  await expect(button(page, 'Check answer')).toHaveCount(0)
  await input(page).fill('Strange rhythm')
  await button(page, 'Send').click(); await expect(button(page, 'Continue with help')).toBeVisible()
  await expect(input(page)).toHaveValue('Strange rhythm'); expect((await saved(page)).attempts).toEqual([])
  await button(page, 'Need help?').click()
  await expect(page.getByText('Ask about this step. Your answer is kept.', { exact: true })).toBeVisible()
  await expect(page.getByText('Send your answer for feedback, or choose Need help to ask a question.', { exact: true })).not.toBeVisible()
  await input(page).fill('Does light turn into sugar?'); await button(page, 'Send').click()
  expect((await saved(page)).attempts).toEqual([])
  await button(page, 'Return to answer').click(); await expect(input(page)).toHaveValue('Strange rhythm')
  await expect(page.getByText('Send your answer for feedback, or choose Need help to ask a question.', { exact: true })).toBeVisible()
  await expect(page.getByText('Ask about this step. Your answer is kept.', { exact: true })).not.toBeVisible()
  await input(page).fill('Light provides energy to build sugar.'); await button(page, 'Send').click()
  const checked = await saved(page); expect(checked.attempts).toHaveLength(1); expect(checked.currentStepId).toBe('guided')
  await input(page).fill('Does light turn into sugar?'); await button(page, 'Send').click()
  expect((await saved(page)).attempts).toEqual(checked.attempts)
})

test('repeat partial seed insertion stays valid and forged/cross-step seeds remain invalid', () => {
  const store = () => useSessionStore.getState()
  store().begin({ topic: 'photosynthesis', confusion: '', diagnostic: 'skipped', correction: '', energy: false }); store().move(1)
  for (let i = 0; i < 3; i++) store().useExample('clarification', 'clarification-turn-11')
  const session = JSON.parse(JSON.stringify(store().session))
  expect(session.usedSeeds).toEqual(['clarification-turn-11'])
  expect(validateSession(session)).not.toBeNull()
  store().useExample('ready', 'ready-turn-13')
  expect(store().session?.answerDrafts.guided.text).toBe('Light gives the plant energy')
  const unknown = structuredClone(session); unknown.usedSeeds.push('forged'); expect(validateSession(unknown)).toBeNull()
  const duplicate = structuredClone(session); duplicate.usedSeeds.push('clarification-turn-11'); expect(validateSession(duplicate)).toBeNull()
  const crossStep = structuredClone(session); crossStep.answerDrafts.guided.seedTurnId = 'ready-turn-13'; crossStep.answerDrafts.guided.pathId = 'ready'; expect(validateSession(crossStep)).toBeNull()
  const forgedPath = structuredClone(session); forgedPath.answerDrafts.guided.pathId = 'invented'; expect(validateSession(forgedPath)).toBeNull()
  store().reset()
})

for (const size of [{ width: 320, height: 500 }, { width: 375, height: 480 }]) {
  test(`expanded example words and multiline uncertain/help drafts preserve reading space ${size.width}`, async ({ page }, info) => {
    await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: 'reduce' }); await begin(page); await button(page, 'Continue').click()
    const examples = await words(page)
    await examples.getByRole('button', { name: 'Partial answer', exact: true }).click()
    await examples.getByRole('button', { name: 'Partial answer', exact: true }).click()
    await button(page, 'Leave').click(); await button(page, 'Continue session').click(); await page.reload()
    expect((await saved(page)).usedSeeds).toEqual(['clarification-turn-11'])
    await expect(input(page)).toHaveValue('Light gives the plant energy')
    await words(page); await input(page).fill('A strange rhythm\n'.repeat(7)); await button(page, 'Send').click()
    const canvas = page.locator('.session-canvas'), dock = page.locator('.session-dock')
    const checkBounds = async () => {
      const reading = (await canvas.boundingBox())!, controls = (await dock.boundingBox())!
      expect(reading.height).toBeGreaterThanOrEqual(90)
      expect(reading.y + reading.height).toBeLessThanOrEqual(controls.y + 1)
      expect(controls.y + controls.height).toBeLessThanOrEqual(size.height + 1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width)
    }
    await expect(button(page, 'Continue with help')).toBeVisible(); await checkBounds()
    await page.screenshot({ path: info.outputPath(`owner-feedback-${size.width}-examples-uncertain.png`) })
    await button(page, 'Need help?').click(); await input(page).fill('I need another example\n'.repeat(7)); await checkBounds()
    await page.screenshot({ path: info.outputPath(`owner-feedback-${size.width}-examples-help.png`) })
    await button(page, 'Return to answer').click(); await expect(input(page)).toHaveValue('A strange rhythm\n'.repeat(7))
  })
}

test('recap shows one example context note while preserving first and retry evidence', async ({ page }) => {
  await begin(page); await button(page, 'Continue').click(); await words(page); await button(page, 'Complete answer').click(); await button(page, 'Send').click(); await button(page, 'Continue').click()
  await words(page); await button(page, 'Partial answer').click(); await button(page, 'Send').click(); await button(page, 'Continue').click()
  await input(page).fill('Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.'); await button(page, 'Send').click(); await button(page, 'View summary').click()
  const results = page.getByRole('region', { name: 'Session results' })
  await expect(results.getByText('Some answers began as examples. Results below describe the answers submitted.', { exact: true })).toHaveCount(1)
  await expect(results).not.toContainText('shows the check, not your understanding')
  await expect(results.getByText('Example answer', { exact: true })).toHaveCount(1)
  await expect(results.getByText('Your answer', { exact: true })).toHaveCount(1)
  await expect(results).toContainText('First situation'); await expect(results).toContainText('Different situation')
})
