import { readFileSync, writeFileSync } from 'node:fs'
const source = JSON.parse(readFileSync(new URL('../plans/phase-0/photosynthesis.v2.json', import.meta.url), 'utf8'))
const fields = ['id', 'version', 'title', 'sourceMaterials', 'initialLearnerInput', 'diagnosis', 'inferredOutcome', 'plan', 'steps', 'assets', 'teachingNotes', 'review']
const output = JSON.stringify(Object.fromEntries(fields.map(key => [key, source[key]])), null, 2) + '\n'
const target = new URL('../src/features/learning/content/phase1-scenario.json', import.meta.url)
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) throw new Error('Phase 1 scenario projection is stale. Run bun scripts/derive-phase1-scenario.mjs')
} else writeFileSync(target, output)
