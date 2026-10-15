import { scenario, type ContentBlock } from '../content/session-scenario'
import { EnergyFlow } from './LearningIllustration'

export function BlockSources({ refs, illustration = false, example = false, label = 'Sources' }: { refs: string[]; illustration?: boolean; example?: boolean; label?: string }) {
  if (!refs.length) return null
  return <details className="mt-3 text-sm text-muted"><summary className="cursor-pointer text-focus">{label}</summary><p>Based on OpenStax Biology 2e.</p>{illustration && <p>Illustration by StudyFellow.</p>}{example && <p>This comparison is an example, not the full chemistry.</p>}{scenario.sourceMaterials.filter(source => refs.includes(source.id)).map(source => <p key={source.id} className="leading-6"><a href={source.url} target="_blank" rel="noreferrer" className="text-focus underline">{source.title} ↗</a><br />{source.locator}</p>)}<p>A biology teacher has not checked this lesson yet.</p></details>
}

const blockLabels: Record<string, string> = {
  explanation: 'Explanation', diagram: 'Diagram', 'worked-example': 'Example',
  'learner-prompt': 'Your turn', 'mini-lesson': 'Short lesson', recap: 'Summary',
}
const blockIcons: Record<string, string> = {
  explanation: '✦', diagram: '📊', 'worked-example': '💡',
  'learner-prompt': '✍️', 'mini-lesson': '🔬', recap: '🌟',
}
export function SessionBlock({ block, stepSourceRefs = [] }: { block: ContentBlock; stepSourceRefs?: string[] }) {
  const asset = 'assetId' in block ? scenario.assets.find(asset => asset.id === block.assetId) : undefined
  return <section data-block-kind={block.kind} className={`session-block session-block-${block.kind}`}>
    <p className="mb-3 mt-0 text-xs font-semibold uppercase tracking-widest text-focus flex items-center gap-1.5">
      <span aria-hidden="true">{blockIcons[block.kind]}</span>
      <span>{blockLabels[block.kind]}</span>
    </p>
    {block.kind === 'diagram' ? <>
      {asset?.id === 'energy-flow' ? <EnergyFlow /> : <p className="rounded-control bg-orbit-soft p-4">The picture isn’t available. You can read the explanation below.</p>}
      <p className="leading-7">{asset?.textEquivalent ?? block.text}</p>
      {asset && <p className="font-medium text-sm text-muted mt-2">{asset.caption}</p>}
    </> : block.kind === 'recap' ? <>
      <h2 className="font-display text-2xl font-normal">The main idea</h2>
      <p className="leading-7">{scenario.steps.find(step => step.id === 'core')?.contentBlocks.find(block => block.kind === 'explanation')?.text}</p>
      <p className="rounded-control bg-accent-soft p-4 leading-6">Apply the idea in a new situation to check your explanation.</p>
      <p className="text-sm leading-6">Next: review the idea and see what your answers showed.</p>
    </> : <p className={block.kind === 'learner-prompt' ? 'font-display text-2xl leading-9 text-ink font-normal' : 'text-lg leading-8 text-ink'}>{block.text}</p>}
    {block.kind === 'mini-lesson' && <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4"><div className="rounded-2xl border border-line/80 bg-orbit-soft/60 p-4 shadow-xs"><div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-focus mb-1"><span>⚡</span><strong>Energy</strong></div><p className="mb-0 text-sm leading-6 text-ink">Captured light</p></div><div className="rounded-2xl border border-line/80 bg-accent-soft/60 p-4 shadow-xs"><div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent-ink mb-1"><span>🌱</span><strong>Materials</strong></div><p className="mb-0 text-sm leading-6 text-ink">Water + carbon dioxide</p></div></div>}
    <BlockSources refs={block.kind === 'recap' ? scenario.teachingNotes.sourceRefs : [...new Set([...block.sourceRefs, ...stepSourceRefs])]} illustration={block.kind === 'diagram'} example={block.kind === 'worked-example'} />
  </section>
}
