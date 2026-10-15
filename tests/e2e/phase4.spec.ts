import { expect, test, type Locator, type Page } from '@playwright/test'
import { scenario, stepTitle } from '../../src/features/learning/content/session-scenario'
import type { Session } from '../../src/features/learning/model/session-store'

// Navigate through the browser's real tab order; never synthesize focus.
async function tabTo(page: Page, target: Locator, backwards = false) {
  for (let count = 0; count < 50; count++) {
    if (await target.evaluate(node => node === document.activeElement)) {
      await expect(target).toBeVisible()
      await expect(target).toBeFocused()
      const focus = await target.evaluate(node => {
        const style = getComputedStyle(node)
        return {
          keyboard: node.matches(':focus-visible'),
          indicator: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
        }
      })
      expect(focus.keyboard).toBe(true)
      expect(focus.indicator).toBe(true)
      return
    }
    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab')
  }
  throw new Error(`Could not reach ${await target.evaluate(node => node.outerHTML)} within 50 ${backwards ? 'reverse ' : ''}tabs`)
}
async function activate(page: Page, target: Locator) {
  await tabTo(page, target)
  await page.keyboard.press('Enter')
}
async function snapshot(page: Page): Promise<Session | null> {
  return page.evaluate(() => {
    const raw = localStorage.getItem('studyfellow.session.v2')
    return raw ? JSON.parse(raw) : null
  })
}

test('real keyboard traversal covers entry, disclosures, sources, composer and leave/resume', async ({ page }) => {
  await page.goto('/start')
  await expect(page.getByRole('heading', { name: 'What feels confusing?' })).toBeFocused()
  await tabTo(page, page.getByRole('textbox', { name: 'Topic or question' }))
  await page.keyboard.type('photosynthesis')
  const confusion = page.getByRole('textbox', { name: 'What’s confusing? (optional)' })
  await tabTo(page, confusion)
  await page.keyboard.type('How does light help sugar building?')
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('textbox', { name: 'Topic or question' })).toBeFocused()
  await activate(page, page.getByRole('button', { name: 'Show my plan' }))
  await expect(page.getByRole('heading', { name: 'One quick question' })).toBeFocused()
  await activate(page, page.getByRole('button', { name: 'Skip question' }))
  const focusDisclosure = page.locator('summary').filter({ hasText: 'Change the focus' })
  await activate(page, focusDisclosure)
  await expect(focusDisclosure.locator('..')).toHaveAttribute('open')
  await tabTo(page, page.getByRole('textbox', { name: 'What should we focus on?' }))
  await tabTo(page, focusDisclosure, true)
  await page.keyboard.press('Enter')
  await expect(focusDisclosure.locator('..')).not.toHaveAttribute('open')
  await activate(page, page.getByRole('button', { name: 'Begin session' }))
  await expect(page.getByRole('heading', { name: stepTitle.core })).toBeFocused()
  const sources = page.locator('.session-canvas summary').filter({ hasText: /^Sources$/ }).first()
  await activate(page, sources)
  await expect(sources.locator('..')).toContainText('A biology teacher has not checked this lesson yet.')
  const sourceLink = sources.locator('..').getByRole('link').first()
  await tabTo(page, sourceLink)
  await expect(sourceLink).toHaveAttribute('href', scenario.sourceMaterials[0].url)
  await expect(sourceLink).toHaveAttribute('target', '_blank')
  const science = page.locator('.session-canvas summary').filter({ hasText: 'More about the science' })
  await activate(page, science)
  await expect(science.locator('..')).toContainText('G3P')
  const input = page.getByRole('textbox', { name: 'Message StudyFellow' })
  await tabTo(page, input)
  await page.keyboard.type('Does light turn into sugar?')
  await activate(page, page.getByRole('button', { name: 'Send', exact: true }))
  await expect(page.getByRole('region', { name: 'Messages at this step' })).toContainText('Light supplies energy, not the matter that becomes sugar.')
  await expect(input).toBeFocused()
  await page.keyboard.type('Keep this keyboard draft')
  await activate(page, page.getByRole('button', { name: 'Leave', exact: true }))
  await expect(page).toHaveURL('/')
  await activate(page, page.getByRole('button', { name: 'Continue session' }))
  await expect(input).toHaveValue('Keep this keyboard draft')
  await page.reload()
  await expect(input).toHaveValue('Keep this keyboard draft')
  await expect(page.getByRole('region', { name: 'Messages at this step' })).toContainText('Does light turn into sugar?')
})

test('confirmed reset clears evidence, added route, example origin and drafts before a fresh reload', async ({ page }) => {
  await page.goto('/start')
  await page.getByRole('button', { name: 'Try photosynthesis' }).click()
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.getByRole('button', { name: 'Begin session' }).click()
  const examples = page.locator('.session-canvas details').first()
  await examples.locator('summary').click()
  page.once('dialog', dialog => dialog.accept())
  await examples.getByRole('button', { name: 'Misconception', exact: true }).click()
  const input = page.getByRole('textbox', { name: 'Message StudyFellow' })
  await input.fill('Does light turn into sugar?')
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await examples.getByRole('button', { name: 'Use example answer' }).click()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await input.fill('Old conversation draft')
  await expect.poll(async () => (await snapshot(page))?.drafts.guided?.text).toBe('Old conversation draft')
  const old = (await snapshot(page))!
  expect(old.attempts).toHaveLength(1)
  expect(old.attempts[0].origin).toBe('example')
  expect(old.route.some(entry => entry.id === 'matter-energy')).toBe(true)
  expect(old.routeChanges).not.toHaveLength(0)
  expect(old.turns).not.toHaveLength(0)
  expect(old.usedSeeds).not.toHaveLength(0)
  expect(old.answerDrafts.guided.origin).toBe('example')
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('messages, answers and saved progress will be cleared')
    await dialog.accept()
  })
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect(page).toHaveURL('/start')
  await expect.poll(() => snapshot(page)).toBeNull()
  await page.getByRole('button', { name: 'Try photosynthesis' }).click()
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.getByRole('button', { name: 'Begin session' }).click()
  await page.reload()
  await expect(page.getByRole('heading', { name: stepTitle.core })).toBeFocused()
  const clean = (await snapshot(page))!
  expect(clean.id).not.toBe(old.id)
  expect(clean).toMatchObject({ currentStepId: 'core', examplePath: null, usedSeeds: [], attempts: [], turns: [], routeChanges: [], answerDrafts: {}, drafts: {}, help: false, clarification: null, completed: false })
  expect(clean.route.map(entry => entry.id)).toEqual(scenario.plan.stepIds)
  expect(clean.route.every(entry => entry.status === 'pending' && !entry.reason)).toBe(true)
  await expect(input).toBeEmpty()
  await expect(page.getByRole('region', { name: 'Messages at this step' })).toHaveCount(0)
  await expect(examples.locator('summary')).toHaveText('Example paths')
})

test('enabled entry and session input boundaries and placeholders have readable contrast', async ({ page }) => {
  const checkContrast = async (input: Locator) => {
    const ratios = await input.evaluate(node => {
      type Color = [number, number, number, number]
      const parse = (value: string): Color => {
        const values = value.match(/[\d.]+/g)?.map(Number)
        if (!values || values.length < 3) throw new Error(`Unsupported computed color: ${value}`)
        return [values[0], values[1], values[2], values[3] ?? 1]
      }
      const over = (front: Color, back: Color): Color => [
        front[0] * front[3] + back[0] * (1 - front[3]),
        front[1] * front[3] + back[1] * (1 - front[3]),
        front[2] * front[3] + back[2] * (1 - front[3]), 1,
      ]
      const background = (element: Element | null): Color => {
        if (!element) return [255, 255, 255, 1]
        return over(parse(getComputedStyle(element).backgroundColor), background(element.parentElement))
      }
      const luminance = (color: Color) => color.slice(0, 3).map(value => {
        const linear = value / 255
        return linear <= .04045 ? linear / 12.92 : ((linear + .055) / 1.055) ** 2.4
      }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0)
      const contrast = (a: Color, b: Color) => {
        const one = luminance(a), two = luminance(b)
        return (Math.max(one, two) + .05) / (Math.min(one, two) + .05)
      }
      const style = getComputedStyle(node), placeholder = getComputedStyle(node, '::placeholder')
      const fill = background(node), outside = background(node.parentElement)
      const ink = parse(placeholder.color)
      ink[3] *= Number(placeholder.opacity)
      return {
        border: contrast(over(parse(style.borderTopColor), outside), outside),
        placeholder: contrast(over(ink, fill), fill),
        borderWidth: parseFloat(style.borderTopWidth),
      }
    })
    expect(ratios.borderWidth).toBeGreaterThan(0)
    expect(ratios.border).toBeGreaterThanOrEqual(3)
    expect(ratios.placeholder).toBeGreaterThanOrEqual(4.5)
  }
  await page.goto('/start')
  await checkContrast(page.getByRole('textbox', { name: 'Topic or question' }))
  await page.getByRole('button', { name: 'Try photosynthesis' }).click()
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.getByRole('button', { name: 'Begin session' }).click()
  await checkContrast(page.getByRole('textbox', { name: 'Message StudyFellow' }))
})
