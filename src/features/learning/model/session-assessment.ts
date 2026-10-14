import { assessGuided, assessTransfer, type GuidedAssessment, type TransferAssessment } from './assessment'
export function assessAnswer(text: string, stepId: string): GuidedAssessment | TransferAssessment {
    const quotedClaim = /(?:a learner (?:says|said)|they (?:say|said)|the statement (?:says|is))[^.!?]*[“"].+?[”"]/i
    const assessedText = stepId === 'follow-up' && quotedClaim.test(text) ? text.replace(quotedClaim, '') : text
    let assessment: GuidedAssessment | TransferAssessment = stepId === 'transfer' || stepId === 'retry' ? assessTransfer(assessedText, stepId === 'retry') : assessGuided(assessedText)
    const matterText = assessedText.toLowerCase().replace(/[’']/g, "'")
    const positiveMatter = /water (?:and |\+ )carbon dioxide (?:are |provide |supply |are both |supply the |provide the )(?:matter|materials|material inputs|matter inputs)|(?:matter|materials|matter inputs|material inputs) (?:are |come from |include )water and carbon dioxide/.test(matterText)
    const deniedMatter = /not true|not correct|false/.test(matterText) || /(?:water|carbon dioxide).{0,50}(?:not |never |aren't|isn't|don't|doesn't|cannot|can't).{0,35}(?:matter|material|provide|supply)|(?:matter|materials).{0,35}(?:not|isn't|aren't).{0,35}(?:water|carbon dioxide)|(?:water|carbon dioxide).{0,25}(?:are|is|provide|supply) (?:only )?energy|(?:not true|not correct|false).{0,35}water|(?:light|sunlight) (?:supplies|provides|is) (?:the )?(?:matter|materials)/.test(matterText)
    if (stepId === 'follow-up' && 'category' in assessment && assessment.category === 'sound' && (!positiveMatter || deniedMatter)) {
      assessment = { category: 'unsure', uncertain: true, evidence: 'The energy-to-sugar connection is present, but the matter-input distinction remains unclear.' }
    }
  return assessment
}
