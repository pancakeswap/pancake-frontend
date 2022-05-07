export const REGISTRATION = 'REGISTRATION'
export const LIVE = 'LIVE'
export const FINISHED = 'FINISHED'
export const CLAIM = 'CLAIM'
export const OVER = 'OVER'

export const CompetitionPhases = {
  REGISTRATION: {
    state: REGISTRATION,
    // 2022–05–17 0:00 AM UTC
    ends: 1652745600000,
    step: { index: 0, text: 'Entry' },
  },
  LIVE: {
    state: LIVE,
    // 2022–05–23 11:59:59 PM UTC
    ends: 1653350399000,
    step: { index: 1, text: 'Live' },
  },
  FINISHED: {
    state: FINISHED,
    ends: null,
    step: { index: 2, text: 'End' },
  },
  CLAIM: {
    state: CLAIM,
    ends: null,
    step: { index: 2, text: 'End' },
  },
  OVER: {
    state: OVER,
    ends: null,
    step: { index: 2, text: 'End' },
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
