import { expect, test, type Page } from '@playwright/test'
const key = 'studyfellow.session.v1'
async function setup(page: Page, minutes = 3) {
  await page.goto('/legacy-start')
  await expect(
    page.getByRole('button', { name: 'Begin lesson' }),
  ).toBeDisabled()
  await page
    .getByRole('button', { name: 'Try photosynthesis' })
    .click()
  if (minutes === 5)
    await page.getByRole('radio', { name: /5 minutes/ }).check()
  await page.getByRole('button', { name: 'Begin lesson' }).click()
}
async function explain(page: Page) {
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Light provides energy to build sugar.')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(page.getByRole('status')).toContainText('connected light energy')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
const good =
  'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.'

test('three-minute path, sources, preserved first score and honest completion', async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await setup(page)
  await page.getByRole('button', { name: 'Skip question' }).click()
  await expect(
    page.getByRole('heading', { name: 'Understand the idea' }),
  ).toBeFocused()
  await page.screenshot({
    path: info.outputPath('explanation.png'),
    fullPage: true,
  })
  await page.getByText('Sources', { exact: true }).click()
  await expect(
    page.getByRole('link', { name: /OpenStax Biology 2e · 8.2/ }),
  ).toHaveAttribute('href', /8-2-the-light/)
  await page.getByRole('button', { name: 'Explain it more simply' }).click()
  await expect(
    page.getByText('Example', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Light is food for the plant.')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(page.getByRole('status')).toContainText(
    'Light supplies energy, not the matter',
  )
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Plant A makes sugar faster.')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(
    page.getByRole('heading', { name: 'Try another situation' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'First answer: 1/2' }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill(
      'Seedling C makes sugar faster because Seedling D has less captured light energy to help build sugar.',
    )
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(page.getByRole('heading', { name: 'Your summary' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'First answer: 1/2' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Second answer: 2/2' }),
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath('recap.png'), fullPage: true })
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Your summary' })).toBeVisible()
  await page.getByRole('button', { name: '← Back' }).click()
  await expect(
    page.getByRole('textbox', { name: 'Your explanation' }),
  ).toHaveAttribute('readonly', '')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(
    await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)!).attempts.length,
      key,
    ),
  ).toBe(3)
  await page.getByRole('button', { name: 'Return home' }).click()
  await expect(
    page.getByRole('button', { name: 'View saved summary' }),
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath('home.png'), fullPage: true })
  expect(errors).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false)
})

test('five-minute path, recall unsure, optional practice and demo provenance', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await setup(page, 5)
  await page.getByRole('button', { name: 'I’m not sure', exact: true }).click()
  await expect(
    page.getByText('Start with this distinction:', { exact: false }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByText('Example answers', { exact: true }).click()
  await page.getByRole('button', { name: 'Energy', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Light provides energy to build sugar.')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(page.getByText('Based on an example')).toBeVisible()
  await page.screenshot({ path: test.info().outputPath('plain-example-answer.png'), fullPage: true })
  await expect(page.locator('main')).not.toContainText(/\b(demo|seeded|legacy)\b/i)
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Extra practice' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Skip extra practice' }).click()
  await page.getByRole('textbox', { name: 'Your explanation' }).fill(good)
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(
    page.getByRole('heading', { name: 'First answer: 2/2' }),
  ).toBeVisible()
  await expect(page.getByText('Step 7 of 7', { exact: false })).toBeVisible()
  await expect(
    page.getByText('Some answers came from examples', { exact: false }),
  ).toBeVisible()
  await page.getByRole('button', { name: '← Back' }).click()
  await page.getByRole('button', { name: '← Back' }).click()
  await expect(
    page.getByRole('heading', { name: 'Extra practice' }),
  ).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Light provides energy to build sugar.')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Extra practice' }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toContainText('connected light energy')
})

test('drafts and setup survive interruption, restart cancellation and unsupported input', async ({
  page,
}) => {
  await page.goto('/lesson')
  await expect(page).toHaveURL(/\/legacy-start$/)
  await page
    .getByRole('textbox', { name: 'What would you like to understand?' })
    .fill('Accounting')
  await page
    .getByRole('textbox', { name: 'What you want to learn (optional)' })
    .fill('Understand a concept')
  await page.reload()
  await expect(
    page.getByRole('textbox', { name: 'What would you like to understand?' }),
  ).toHaveValue('Accounting')
  await expect(
    page.getByRole('button', { name: 'Begin lesson' }),
  ).toBeDisabled()
  await page.getByRole('tab', { name: 'Resource' }).click()
  await page
    .getByLabel('Choose a local file')
    .setInputFiles({
      name: 'my-notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('private content'),
    })
  await expect(page.getByText('Selected locally: my-notes.txt')).toBeVisible()
  await page
    .getByRole('button', { name: 'Try photosynthesis' })
    .click()
  await page.getByRole('button', { name: 'Begin lesson' }).click()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'One quick question' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('unfinished reasoning')
  await page.reload()
  await expect(
    page.getByRole('textbox', { name: 'Your explanation' }),
  ).toHaveValue('unfinished reasoning')
  await page.getByRole('button', { name: 'Save and leave' }).click()
  await expect(page.getByText('Next: Explain the role of light')).toBeVisible()
  page.once('dialog', (d) => d.dismiss())
  await page.getByRole('button', { name: 'Restart saved lesson' }).click()
  await page.getByRole('button', { name: 'Resume saved lesson' }).click()
  await expect(
    page.getByRole('textbox', { name: 'Your explanation' }),
  ).toHaveValue('unfinished reasoning')
  expect(
    await page.evaluate((k) => localStorage.getItem(k), key),
  ).not.toContain('private content')
})

test('uncertain answers clarify, zero-score retry finishes with unresolved evidence', async ({
  page,
}) => {
  await setup(page)
  await explain(page)
  await page.getByRole('textbox', { name: 'Your explanation' }).fill('banana')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(page.getByRole('status')).toContainText('not sure what your answer means')
  await page.screenshot({ path: test.info().outputPath('plain-unclear-answer.png'), fullPage: true })
  await expect(
    page.getByRole('heading', { name: 'Try a new situation' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Send as it is' }).click()
  await expect(
    page.getByRole('heading', { name: 'First answer: 0/2' }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Try another situation' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'I’m not sure', exact: true }).click()
  await page.getByRole('button', { name: 'Send as it is' }).click()
  await expect(
    page.getByRole('heading', { name: 'Second answer: 0/2' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Revisit explanation' }).click()
  await expect(
    page.getByRole('heading', { name: 'Understand the idea' }),
  ).toBeVisible()
})

test('corrupt storage is recoverable only through confirmed reset', async ({
  page,
}) => {
  await page.addInitScript((k) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem(k, '{broken')
      sessionStorage.setItem('seeded', 'yes')
    }
  }, key)
  await page.goto('/legacy-start')
  await expect(page.getByRole('status')).toContainText(
    'We couldn’t open your saved lesson',
  )
  await page.screenshot({ path: test.info().outputPath('plain-saved-recovery.png'), fullPage: true })
  page.once('dialog', (d) => d.dismiss())
  await page.getByRole('button', { name: 'Reset saved session' }).click()
  await expect(page.getByRole('status')).toBeVisible()
  page.once('dialog', (d) => d.accept())
  await page.getByRole('button', { name: 'Reset saved session' }).click()
  await expect(
    page.getByText('We couldn’t open your saved lesson.'),
  ).not.toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Try photosynthesis' }),
  ).toBeVisible()
})

test('storage failure allows learning with an explicit recovery warning', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Unavailable')
    }
    Storage.prototype.getItem = () => {
      throw new DOMException('Unavailable')
    }
  })
  await setup(page)
  await expect(page.getByRole('status')).toContainText(
    'Your progress can’t be saved',
  )
  await page.getByRole('button', { name: 'Skip question' }).click()
  await expect(
    page.getByRole('heading', { name: 'Understand the idea' }),
  ).toBeVisible()
})

test('unknown routes and failed lazy imports recover', async ({ page }) => {
  await page.goto('/missing-page')
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Return home' }).click()
  await expect(page.getByRole('button', { name: 'Learn now' })).toBeVisible()
  test.skip(!!process.env.PLAYWRIGHT_PRODUCTION, 'Dev import interception only')
  await page.route(
    '**/src/features/learning/routes/lesson-route.tsx*',
    (route) => route.abort(),
  )
  await page.goto('/lesson')
  await expect(
    page.getByRole('heading', { name: 'We couldn’t open this page' }),
  ).toBeVisible()
  await page.unroute('**/src/features/learning/routes/lesson-route.tsx*')
  await page.getByRole('button', { name: 'Reload page' }).click()
  await expect(page).toHaveURL(/\/legacy-start$/)
})

test('keyboard sample handoff and narrow layout retain focus access', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 812 })
  await page.goto('/legacy-start')
  await expect(
    page.getByRole('heading', { name: 'Start a saved lesson' }),
  ).toBeFocused()
  await page.getByRole('tab', { name: 'Topic', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: /Resource$/ })).toBeFocused()
  await page.keyboard.press('Enter')
  await page
    .getByLabel('Choose a local file')
    .setInputFiles({
      name: 'very-long-filename-'.repeat(12) + '.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('ignored'),
    })
  await page
    .getByRole('textbox', { name: 'What you want to learn (optional)' })
    .fill('A'.repeat(500))
  await page.screenshot({
    path: info.outputPath('setup-320.png'),
    fullPage: true,
  })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false)
  await page
    .getByRole('button', { name: 'Try photosynthesis' })
    .click()
  await page.getByRole('button', { name: 'Begin lesson' }).click()
  await page.getByRole('button', { name: 'Skip question' }).click()
  await page.screenshot({
    path: info.outputPath('explanation-320.png'),
    fullPage: true,
  })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false)
})

test('production cached revisit works offline with saved drafts', async ({
  page,
  context,
}) => {
  test.skip(
    !process.env.PLAYWRIGHT_PRODUCTION,
    'Requires production service worker',
  )
  await setup(page)
  await explain(page)
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Plant A makes sugar faster.')
  await page.getByRole('button', { name: 'Save and leave' }).click()
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true)
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: 'Resume saved lesson' }).click()
  await expect(
    page.getByRole('textbox', { name: 'Your explanation' }),
  ).toHaveValue('Plant A makes sugar faster.')
  await page.getByRole('textbox', { name: 'Your explanation' }).fill(good)
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(
    page.getByRole('heading', { name: 'First answer: 2/2' }),
  ).toBeVisible()
})

test('five-minute submitted practice, feedback and transfer drafts resume with keyboard actions', async ({
  page,
}) => {
  await setup(page, 5)
  await page
    .getByRole('button', { name: 'Water and carbon dioxide', exact: true })
    .focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Understand the idea' }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Continue', exact: true }).focus()
  await page.keyboard.press('Enter')
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Light provides energy.')
  await page.getByRole('button', { name: 'Check my thinking' }).focus()
  await page.keyboard.press('Enter')
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Let’s look at your answer' }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toContainText(
    'Add the next connection',
  )
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Light is not food. It provides energy to build sugar.')
  await page.getByRole('button', { name: 'Check my thinking' }).click()
  await expect(page.getByRole('status')).toContainText('connected light energy')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Your explanation' })
    .fill('Plant A makes sugar faster.')
  await page.reload()
  await expect(
    page.getByRole('heading', { name: 'Try a new situation' }),
  ).toBeVisible()
  await expect(
    page.getByRole('textbox', { name: 'Your explanation' }),
  ).toHaveValue('Plant A makes sugar faster.')
})
