export const REGISTRATION = 'REGISTRATION'
export const LIVE = 'LIVE'
export const FINISHED = 'FINISHED'
export const CLAIM = 'CLAIM'
export const OVER = 'OVER'

interface CompetitionStepProps {
  index?: number
  text?: string
  translationId: number
}

export interface CompetitionPhaseProps {
  state?: string
  ends?: number | null
  step?: CompetitionStepProps
}

export const CompetitionPhases = {
  REGISTRATION: {
    state: REGISTRATION,
    // Wed 7th 16:00 SGT
    ends: 1617782400000,
    step: { index: 0, text: 'Entry', translationId: 999 },
  },
  LIVE: {
    state: LIVE,
    // ~ Wed 14th 16:00 SGT
    ends: 1618387200000,
    step: { index: 1, text: 'Live', translationId: 1198 },
  },
  FINISHED: {
    state: FINISHED,
    ends: null,
    step: { index: 2, text: 'End', translationId: 410 },
  },
  CLAIM: {
    state: CLAIM,
    ends: null,
    step: { index: 2, text: 'End', translationId: 410 },
  },
  OVER: {
    state: OVER,
    ends: null,
    step: { index: 2, text: 'End', translationId: 410 },
  },
}

export const CompetitionSteps = [
  CompetitionPhases.REGISTRATION.step,
  CompetitionPhases.LIVE.step,
  CompetitionPhases.FINISHED.step,
]

export const SmartContractPhases = {
  0: CompetitionPhases.REGISTRATION,
  1: CompetitionPhases.LIVE,
  2: CompetitionPhases.FINISHED,
  3: CompetitionPhases.CLAIM,
  4: CompetitionPhases.OVER,
}
