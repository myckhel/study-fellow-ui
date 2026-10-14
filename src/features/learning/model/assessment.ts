/** Conservative local demo rules. Unrecognized wording requires clarification, not a claim of error. */
export type GuidedCategory = 'material' | 'energy' | 'sound' | 'unsure'
export type GuidedAssessment = {
  category: GuidedCategory
  evidence: string
  uncertain: boolean
}
export type TransferAssessment = {
  score: number
  prediction: boolean
  reasoning: boolean
  evidence: [string, string]
  uncertain: boolean
}
const normalize = (text: string) =>
  text.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim()
const unsure = (text: string) =>
  /\b(not sure|unsure|don't know|do not know|no idea)\b/.test(text)
const negatedEnergy = (text: string) =>
  /(?:not|never|doesn't|does not|isn't|is not|cannot|can't|no) (?:\w+ ){0,3}(?:energy|help|support|power|use|build|make|produce)/.test(
    text,
  )
const materialClaim = (text: string) =>
  /(?:light|sunlight|sun) (?:is |provides |gives |becomes |turns into )(?:the |a |plants?[' ]* )?(?:food|material|matter|sugar)/.test(
    text,
  )
const opposedRole = (text: string) =>
  /\b(?:prevents?|irrelevant|unrelated|useless|stops?|unnecessary)\b/.test(text)
const deniedMaterial = (text: string) =>
  /(?:light|sunlight) (?:is |supplies |provides )?(?:not|isn't|is not) (?:a |the )?(?:food|material|matter|sugar)/.test(
    text,
  )
const buildConnection = (text: string) =>
  /(?:energy|help|support|power|used|uses|use|needed|need|enables?).{0,65}(?:make|making|build|building|produce|producing|production).{0,25}(?:sugar|glucose|carbohydrate)/.test(
    text,
  ) ||
  /(?:energy|help|support|power).{0,45}(?:sugar|glucose|carbohydrate)[- ](?:building|production)/.test(
    text,
  )

export function assessGuided(answer: string): GuidedAssessment {
  const text = normalize(answer)
  const energy = /\benergy\b/.test(text)
  const material = materialClaim(text)
  if (
    unsure(text) ||
    opposedRole(text) ||
    negatedEnergy(text) ||
    (material && (energy || deniedMaterial(text)))
  )
    return {
      category: 'unsure',
      evidence:
        'Meaning is uncertain or contradictory; clarification is needed.',
      uncertain: true,
    }
  if (material)
    return {
      category: 'material',
      evidence: 'Answer describes light as food or matter.',
      uncertain: false,
    }
  if (energy && /\b(?:light|sunlight)\b/.test(text) && buildConnection(text))
    return {
      category: 'sound',
      evidence: 'Answer connects light energy with building sugar.',
      uncertain: false,
    }
  if (energy)
    return {
      category: 'energy',
      evidence: 'Energy is named; its role in sugar building is not yet clear.',
      uncertain: false,
    }
  return {
    category: 'unsure',
    evidence: 'No clear energy-to-sugar connection recognized by demo rules.',
    uncertain: true,
  }
}
export function assessTransfer(
  answer: string,
  retry = false,
): TransferAssessment {
  const text = normalize(answer)
  const right = retry ? 'c' : 'a'
  const wrong = retry ? 'd' : 'b'
  const faster =
    '(?:(?:makes?|produces?|builds?) (?:more (?:sugar|glucose)|(?:sugar|glucose) (?:faster|at a higher rate))|(?:is |has )?(?:faster|higher sugar[- ]production|higher production))'
  const slower =
    '(?:makes?|produces?|builds?) (?:less (?:sugar|glucose)|(?:sugar|glucose) (?:slower|at a lower rate))'
  const correct =
    new RegExp(`(?:plant|seedling) ${right} ${faster}`).test(text) ||
    new RegExp(`(?:plant|seedling) ${wrong} ${slower}`).test(text) ||
    new RegExp(`^(?:plant|seedling) ${right}(?:[.,;:]| because|$)`).test(text)
  const incorrect =
    new RegExp(`(?:plant|seedling) ${wrong} ${faster}`).test(text) ||
    new RegExp(`(?:plant|seedling) ${right} ${slower}`).test(text) ||
    /same (?:amount|rate)|no (?:change|difference)/.test(text)
  const negation =
    /(?:doesn't|does not|will not|won't|not|never) (?:\w+ ){0,3}(?:faster|slower|more|less|make|produce|build)/.test(
      text,
    )
  const reversedAttribution = new RegExp(
    `(?:plant|seedling) ${right}(?: (?:has|gets|receives)|.{0,45}(?:because|since) it (?:has|gets|receives)) (?:less|lower|reduced) (?:captured |available |light |usable |chemical ){0,3}energy`,
  ).test(text)
  const wrongDirection =
    new RegExp(
      `(?:plant|seedling) ${wrong}.{0,35}(?:more|greater|higher) (?:captured |available |light |usable |chemical ){0,3}energy`,
    ).test(text) ||
    /(?:less|lower|reduced) (?:captured |available |light |usable |chemical ){0,3}energy.{0,50}(?:more sugar|sugar faster|sugar at a higher rate)/.test(
      text,
    )
  const contradiction =
    incorrect ||
    reversedAttribution ||
    negation ||
    materialClaim(text) ||
    negatedEnergy(text) ||
    opposedRole(text) ||
    wrongDirection
  const energyWords =
    '(?:captured |available |light |usable |chemical ){0,3}energy'
  const attribution =
    new RegExp(
      `(?:plant|seedling) ${wrong}.{0,40}(?:less|lower|reduced) ${energyWords}`,
    ).test(text) ||
    /(?:dimmer|less) light.{0,45}(?:less|lower|reduced) (?:captured |available |light |usable |chemical ){0,3}energy/.test(
      text,
    ) ||
    new RegExp(
      `(?:plant|seedling) ${right}.{0,65}(?:more|greater|higher) ${energyWords}`,
    ).test(text) ||
    /brighter light.{0,45}(?:more|greater|higher) (?:captured |available |light |usable |chemical ){0,3}energy/.test(
      text,
    )
  const energyContrast =
    /(?:less|more|lower|higher|reduced|greater) (?:captured |available |light |usable |chemical ){0,3}energy/.test(
      text,
    )
  const reasoning =
    !contradiction &&
    !unsure(text) &&
    energyContrast &&
    attribution &&
    /(?:light|sunlight|captured).{0,35}energy|energy.{0,35}(?:light|sunlight)/.test(
      text,
    ) &&
    buildConnection(text)
  const prediction = correct && !incorrect && !negation && !unsure(text)
  return {
    score: Number(prediction) + Number(reasoning),
    prediction,
    reasoning,
    uncertain: contradiction || unsure(text) || (!prediction && !reasoning),
    evidence: [
      prediction
        ? 'Recognized the higher production rate in brighter light.'
        : 'Still needed: clearly identify which plant makes sugar faster.',
      reasoning
        ? 'Connected available light energy to sugar building.'
        : 'Still needed: connect less captured light energy to less energy for sugar building.',
    ],
  }
}
