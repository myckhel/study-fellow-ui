import { expect, test, type Page } from '@playwright/test'
import { scenario } from '../../src/features/learning/content/session-scenario'
import { activeDraft, useSessionStore } from '../../src/features/learning/model/session-store'
test.describe.configure({ timeout: 60000 })
async function begin(page: Page) {
  await page.goto('/start')
  await page.getByRole('button', { name: 'Try photosynthesis' }).click(); await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.getByRole('button', { name: 'Begin session' }).click()
}
const store = () => useSessionStore.getState()
const session = () => store().session!
const fresh = () => store().begin({ topic: 'photosynthesis', confusion: '', diagnostic: 'skipped', correction: '', energy: false })

test('adaptive evidence, clarification, route history and immutability', () => {
  for (const [text, support] of [['Sunlight becomes food', 'matter-energy'], ['Light provides energy.', 'energy-bridge'], ['strange rhythm', 'matter-energy']]) {
    fresh(); store().move(1); store().setDraft(text); store().check()
    if (text === 'strange rhythm') { expect(session().attempts).toHaveLength(0); expect(activeDraft(session())?.text).toBe(text); store().check(true) }
    expect(session().route.some(entry => entry.id === support)).toBe(true)
    const attempt = session().attempts[0]
    const route = JSON.stringify(session().route)
    store().check(); expect(session().attempts).toHaveLength(1)
    expect(Object.isFrozen(attempt)).toBe(true)
    expect(session().routeChanges[0].triggerAttemptId).toBe(attempt.id)
    expect(session().turns.filter(turn => turn.attemptId === attempt.id)).toHaveLength(2)
    store().move(-1); store().move(1); store().check()
    expect(session().attempts[0]).toBe(attempt); expect(JSON.stringify(session().route)).toBe(route)
  }
  fresh(); store().move(1); store().setDraft('Light provides energy to help build sugar.'); store().check()
  expect(session().route.find(entry => entry.id === 'example')?.status).toBe('skipped')
  store().move(1); expect(session().currentStepId).toBe('transfer'); expect(session().attempts).toHaveLength(1)
  expect(session().originalRoute).toEqual(scenario.plan.stepIds)
  store().reset()
})

test('help preserves exact example answer and edited origin; Send never checks', () => {
  fresh(); store().selectPath('ready'); store().move(1); store().useExample(); store().setDraft('Light is food for plants')
  const draft = activeDraft(session())!
  expect(draft).toMatchObject({ origin: 'example', pathId: 'ready', seedTurnId: 'ready-turn-09', edited: true })
  store().send(); expect(session().attempts).toHaveLength(0); expect(activeDraft(session())).toBe(draft)
  store().help(true); store().setDraft('Does light turn into sugar?'); store().send(); store().help(false)
  expect(activeDraft(session())).toBe(draft)
  store().check(); expect(session().attempts[0]).toMatchObject({ text: 'Light is food for plants', origin: 'example', edited: true, assessment: { category: 'material' } })
  expect(scenario.examplePaths[0].inputs[0].text).toBe('Light provides energy that helps the plant build sugar.')
  store().reset()
})

test('contradictory and insufficient follow-up never imply success', () => {
  for (const text of ['Light provides energy but light is food', 'Light provides energy to help build sugar.', 'Light provides energy to help build sugar. Water and carbon dioxide are not materials.', 'Light provides energy to help build sugar. Water and carbon dioxide aren’t materials.', 'Light provides energy to help build sugar. Water and carbon dioxide do not provide matter.', 'Light provides energy to help build sugar. Water and carbon dioxide are materials, but this is not true.', 'Light provides energy to help build sugar. Water and carbon dioxide never supply matter.', 'Light provides energy to help build sugar. Light supplies materials, water and carbon dioxide provide energy.', 'A learner says “Sunlight is a material the plant turns into food.”']) {
    fresh(); store().move(1); store().setDraft('Sunlight becomes food'); store().check(); store().move(1); store().move(1); store().setDraft(text); store().check()
    expect(session().attempts).toHaveLength(1); expect(session().clarification).toBe('follow-up')
    store().move(1); expect(session().currentStepId).toBe('follow-up')
    store().check(true); expect(session().attempts[1].assessment.uncertain).toBe(true)
  }
  fresh(); store().move(1); store().setDraft('Light is food'); store().check(); store().move(1); store().move(1)
  store().setDraft('A learner says “Sunlight is a material the plant turns into food.” Light provides energy to help build sugar. Water and carbon dioxide are materials.')
  store().check(); expect(session().attempts[1].assessment).toMatchObject({ category: 'sound' })
  store().reset()
})

for (const path of ['ready', 'misconception', 'clarification']) {
  test(`example path ${path} reaches checked transfer and evidence recap`, async ({ page }, info) => {
    test.setTimeout(60000)
    await begin(page)
    const examples = page.locator('.session-canvas details').first()
    await examples.locator('summary').click()
    page.once('dialog', dialog => dialog.accept())
    await examples.getByRole('button', { name: `Restart with ${path} example`, exact: true }).click()
    const input = page.getByRole('textbox', { name: 'Message StudyFellow' })
    if (path === 'clarification') {
      await examples.getByRole('button', { name: 'Use example message' }).click()
      await page.getByRole('button', { name: 'Send', exact: true }).click()
      await expect(page.getByText('Light supplies energy, not the matter that becomes sugar.', { exact: false })).toBeVisible()
    }
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await examples.getByRole('button', { name: 'Use example answer' }).click()
    if (path === 'clarification') {
      const saved = await input.inputValue()
      await examples.getByRole('button', { name: 'Use example message' }).click()
      await expect(page.getByRole('button', { name: 'Return to answer' })).toBeVisible()
      await page.getByRole('button', { name: 'Send', exact: true }).click()
      await page.getByRole('button', { name: 'Return to answer' }).click()
      await expect(input).toHaveValue(saved)
      page.once('dialog', dialog => dialog.accept())
      await examples.getByRole('button', { name: 'Use example answer' }).click()
    }
    await page.getByRole('button', { name: 'Send', exact: true }).click()
    await expect(page.getByRole('article', { name: 'Answer feedback' })).toContainText('Route changed:')
    await page.screenshot({ path: info.outputPath(`phase2-${path}-route.png`) })
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    if (path === 'misconception') {
      await expect(page.getByRole('heading', { name: 'Energy and materials' })).toBeFocused()
      await page.getByRole('button', { name: 'Continue', exact: true }).click()
      await expect(page.getByRole('heading', { name: 'Try the distinction' })).toBeFocused()
      await examples.getByRole('button', { name: 'Use example answer' }).click()
      await page.getByRole('button', { name: 'Send', exact: true }).click()
      await page.getByRole('button', { name: 'Continue', exact: true }).click()
      await page.getByRole('button', { name: 'Continue', exact: true }).click()
    }
    await expect(page.getByRole('heading', { name: 'Apply the idea' })).toBeFocused()
    await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeVisible()
    await examples.getByRole('button', { name: 'Use example answer' }).click()
    await page.getByRole('button', { name: 'Send', exact: true }).click()
    if (path === 'misconception') {
      await page.getByRole('button', { name: 'Continue', exact: true }).click()
      await expect(page.getByRole('heading', { name: 'A different situation' })).toBeFocused()
      await examples.getByRole('button', { name: 'Use example answer' }).click()
      await page.getByRole('button', { name: 'Send', exact: true }).click()
    }
    await page.getByRole('button', { name: 'View summary' }).click()
    await expect(page.getByRole('region', { name: 'Session results' })).toContainText('First situation')
    await expect(page.locator('main')).not.toContainText(/2\/2|mastery/i)
    await page.screenshot({ path: info.outputPath(`phase2-${path}-summary.png`) })
  })
}

test('unknown with topic keyword gets bounded reply; help and replacement cancellation preserve work', async ({ page }) => {
  await begin(page)
  const input = page.getByRole('textbox', { name: 'Message StudyFellow' })
  await input.fill('Is light blue harmful?'); await page.getByRole('button', { name: 'Send', exact: true }).click()
  await expect(page.getByText('I don’t have a prepared reply', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await input.fill('Light provides energy but light is food')
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await expect(input).toBeFocused(); await expect(page.getByRole('button', { name: 'Continue', exact: true })).not.toBeVisible()
  await page.getByRole('button', { name: 'Need help?' }).click()
  await expect(page.getByRole('button', { name: 'Continue with help' })).not.toBeVisible()
  await input.fill('show another example'); await page.getByRole('button', { name: 'Send', exact: true }).click()
  await page.getByRole('button', { name: 'Return to answer' }).click()
  await expect(input).toHaveValue('Light provides energy but light is food')
  const examples = page.locator('.session-canvas details').first(); await examples.locator('summary').click()
  page.once('dialog', dialog => dialog.dismiss()); await examples.getByRole('button', { name: 'Restart with ready example', exact: true }).click()
  await expect(input).toHaveValue('Light provides energy but light is food')
  await page.getByRole('button', { name: 'Send', exact: true }).click(); await page.getByRole('button', { name: 'Continue with help' }).click()
  await expect(page.getByRole('article', { name: 'Answer feedback' })).toContainText('Let’s make that clearer')
  await page.getByRole('button', { name: 'Continue', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Energy and materials' })).toBeFocused()
})

for (const size of [{ width: 320, height: 500 }, { width: 375, height: 480 }]) {
  test(`compound unclear edited example dock ${size.width}`, async ({ page }, info) => {
    await page.setViewportSize(size); await page.emulateMedia({ reducedMotion: 'reduce' }); await begin(page)
    const examples = page.locator('.session-canvas details').first(); await examples.locator('summary').click()
    page.once('dialog', dialog => dialog.accept()); await examples.getByRole('button', { name: 'Restart with ready example', exact: true }).click()
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await examples.getByRole('button', { name: 'Use example answer' }).click()
    const input = page.getByRole('textbox', { name: 'Message StudyFellow' })
    await input.fill('A strange rhythm of the sky\n'.repeat(7))
    const canvas = page.getByRole('region', { name: 'Teaching and conversation' })
    await canvas.evaluate(node => { node.scrollTop = 0 })
    await page.getByRole('button', { name: 'Send', exact: true }).click()
    await page.locator('.session-route-mobile > summary').click()
    await expect(page.getByText('Example answer · edited', { exact: true })).toBeVisible()
    await expect.poll(async () => (await canvas.boundingBox())!.height).toBeGreaterThanOrEqual(90)
    const dock = (await page.locator('.session-dock').boundingBox())!
    expect(dock.y + dock.height).toBeLessThanOrEqual(size.height + 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width)
    await expect(page.getByRole('button', { name: 'Continue with help' })).toBeVisible()
    await page.screenshot({ path: info.outputPath(`phase2-${size.width}-compound.png`) })
  })
}
