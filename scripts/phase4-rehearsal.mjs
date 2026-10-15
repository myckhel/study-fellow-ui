// Production-only presenter rehearsal. Uses an isolated browser profile and fictional input.
// Start `bun run preview --host 127.0.0.1 --port 5174 --strictPort` first.
import { chromium, expect } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const baseURL = 'http://127.0.0.1:5174'
const outputFlag = process.argv.indexOf('--output')
if (outputFlag >= 0 && (!process.argv[outputFlag + 1] || process.argv[outputFlag + 1].startsWith('--'))) throw new Error('--output requires a directory')
const output = resolve(outputFlag >= 0 ? process.argv[outputFlag + 1] : 'plans/phase-4')
mkdirSync(`${output}/screenshots`, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
const start = performance.now()
const beats = []
const button = name => page.getByRole('button', { name, exact: true })
const input = () => page.getByRole('textbox', { name: 'Message StudyFellow' })
async function capture(name, note) {
  await page.screenshot({ path: `${output}/screenshots/${name}.png` })
  const beat = { name, seconds: +((performance.now() - start) / 1000).toFixed(2), note }
  beats.push(beat)
  console.log(JSON.stringify(beat))
}
// Optional pacing exercises the planned narration budget; fast mode measures interaction time only.
const paced = process.argv.includes('--paced')
async function holdUntil(seconds) {
  if (!paced) return
  while (performance.now() - start < seconds * 1000) {
    await new Promise(resolve => setTimeout(resolve, Math.min(10000, seconds * 1000 - (performance.now() - start))))
  }
}
try {
  await page.goto(baseURL)
  await page.getByRole('button', { name: 'Learn now' }).click()
  await page.getByRole('textbox', { name: 'Topic or question' }).fill('photosynthesis')
  await page.getByRole('textbox', { name: 'What’s confusing? (optional)' }).fill('I think light might be food for plants')
  await button('Continue').click()
  await button('Skip question').click()
  await capture('01-inferred-plan', 'One available topic; prepared outcome and route, not live AI planning.')
  await holdUntil(30)
  await button('Begin session').click()
  await page.locator('[data-block-kind="diagram"]').scrollIntoViewIfNeeded()
  await capture('02-diagram', 'Light supplies energy; water and carbon dioxide are materials. Text and source access accompany the diagram.')
  await input().fill('Does light turn into sugar?')
  await button('Send').click()
  await expect(page.getByRole('region', { name: 'Messages at this step' })).toContainText('Light supplies energy, not the matter')
  await capture('03-contextual-clarification', 'Send responds in context without checking or advancing.')
  await holdUntil(65)
  await button('Continue').click()
  await input().fill('Light is food for plants')
  await button('Send').click()
  await expect(page.getByRole('article', { name: 'Answer feedback' })).toContainText('Route changed:')
  await capture('04-adapted-route', 'The misconception adds targeted support; route change is visible.')
  await holdUntil(100)
  await button('Continue').click()
  await capture('05-targeted-support', 'Separate energy from materials before another check.')
  await button('Continue').click()
  await input().fill('Light provides energy to help build sugar. Water and carbon dioxide are materials.')
  await button('Send').click()
  await button('Continue').click()
  await button('Continue').click()
  await expect(page.getByRole('heading', { name: 'Apply the idea' })).toBeFocused()
  const answer = 'Plant A makes sugar faster because Plant B has less captured light energy to help build sugar.'
  await input().fill(answer)
  await capture('06-fresh-check-draft', 'A new situation checks prediction and energy reasoning separately.')
  await holdUntil(145)
  await button('Leave').click()
  await expect(page).toHaveURL(`${baseURL}/`)
  await page.reload()
  await capture('07-home-resume', 'One browser-local resume action; no account or cross-device sync.')
  await button('Continue session').click()
  await expect(input()).toHaveValue(answer)
  await capture('08-restored-draft', 'Draft survives leaving and reload.')
  await holdUntil(180)
  await button('Send').click()
  await button('View summary').click()
  await expect(page.getByRole('region', { name: 'Session results' })).toContainText('How light energy helps · Clear')
  await capture('09-recap-results', 'Prediction and energy reasoning are separate; completion is not a mastery claim.')
  await page.getByText('Read the sources', { exact: true }).click()
  await page.locator('#recap-sources').scrollIntoViewIfNeeded()
  await capture('10-recap-sources', 'Presenter input proves interface behavior, not learner improvement; biology review and learner observation are pending.')
  await holdUntil(210)
  if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`)
  const result = { date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()), timezone: 'Africa/Lagos', kind: paced ? 'automated paced rehearsal; no human narration' : 'automated interaction timing; no human narration', browser: browser.version(), viewport: '1280x900', elapsedSeconds: +((performance.now() - start) / 1000).toFixed(2), beats, pageErrors: errors }
  writeFileSync(`${output}/rehearsal-result.json`, JSON.stringify(result, null, 2) + '\n')
  console.log(JSON.stringify(result))
} finally { await browser.close() }
