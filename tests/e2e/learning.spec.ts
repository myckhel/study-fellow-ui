import { expect, test } from '@playwright/test'

test('lazy learning routes preserve the demo interaction', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('button', { name: 'How it works' }).click()
  await expect(page.getByText('StudyFellow explains one idea', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Continue learning' }).click()
  await expect(page).toHaveURL(/\/lesson$/)
  const check = page.getByRole('button', { name: 'Check my thinking' })
  await expect(check).toBeDisabled()
  await page.getByRole('textbox', { name: 'Your explanation' }).fill('Less light means less energy to make sugar.')
  await check.click()
  await expect(page.getByRole('status')).toContainText('Less light')
  await page.getByRole('button', { name: 'Finish demo lesson' }).click()
  await expect(page.getByText('1 lesson complete', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('lesson deep links load directly with source attribution', async ({ page }) => {
  await page.goto('/lesson')
  await expect(page.getByRole('heading', { name: 'How does light help a plant make sugar?' })).toBeVisible()
  await expect(page.getByRole('link', { name: /OpenStax source/ })).toHaveAttribute('href', /openstax.org/)
})

test('unknown routes have a recovery path', async ({ page }) => {
  await page.goto('/missing-page')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Return home' }).click()
  await expect(page.getByRole('button', { name: 'Continue learning' })).toBeVisible()
})

test('failed lazy imports show recovery and reload succeeds', async ({ page }) => {
  await page.route('**/src/features/learning/routes/lesson-route.tsx*', (route) => route.abort())
  await page.goto('/lesson')
  await expect(page.getByRole('heading', { name: 'We couldn’t open this page' })).toBeVisible()
  await page.unroute('**/src/features/learning/routes/lesson-route.tsx*')
  await page.getByRole('button', { name: 'Reload page' }).click()
  await expect(page.getByRole('textbox', { name: 'Your explanation' })).toBeVisible()
})
