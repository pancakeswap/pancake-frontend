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

export interface CompetitionStateInstance {
  state?: string
  startBlock?: number | null
  step?: CompetitionStepProps
}

export const CompetitionState = {
  REGISTRATION: {
    state: REGISTRATION,
    // Mon 5th 16:00 SGT
    startBlock: 6299060,
    step: { index: 0, text: 'Entry', translationId: 999 },
  },
  LIVE: {
    state: LIVE,
    // Wed 7th 16:00 SGT
    startBlock: 6356660,
    step: { index: 1, text: 'Live', translationId: 1198 },
  },
  FINISHED: {
    state: FINISHED,
    // Wed 14th 16:00 SGT
    startBlock: 6961460,
    step: { index: 2, text: 'End', translationId: 410 },
  },
  CLAIM: {
    state: CLAIM,
    startBlock: null,
    step: { index: 2, text: 'End', translationId: 410 },
  },
  OVER: {
    state: OVER,
    startBlock: null,
    step: { index: 2, text: 'End', translationId: 410 },
  },
}

export const CompetitionSteps = [
  CompetitionState.REGISTRATION.step,
  CompetitionState.LIVE.step,
  CompetitionState.FINISHED.step,
]

export const SmartContractStates = {
  0: CompetitionState.REGISTRATION,
  1: CompetitionState.LIVE,
  2: CompetitionState.FINISHED,
  3: CompetitionState.CLAIM,
  4: CompetitionState.OVER,
}
