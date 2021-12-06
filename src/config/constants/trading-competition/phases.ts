export const REGISTRATION = 'REGISTRATION'
export const LIVE = 'LIVE'
export const FINISHED = 'FINISHED'
export const CLAIM = 'CLAIM'
export const OVER = 'OVER'

export const CompetitionPhases = {
  REGISTRATION: {
    state: REGISTRATION,
    // Fri Dec 06 2021 16:00:00 SGT
    ends: 1638777600000, // TODO: update here
    step: { index: 0, text: 'Entry' },
  },
  LIVE: {
    state: LIVE,
    // Fri Dec 13 2021 16:00:00 SGT
    ends: 1639382400000, // TODO: update here
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
