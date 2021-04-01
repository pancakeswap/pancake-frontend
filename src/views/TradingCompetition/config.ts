export const REGISTRATION = 'REGISTRATION'
export const LIVE = 'LIVE'
export const FINISHED = 'FINISHED'

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
}

export const CompetitionSteps = [
  CompetitionState.REGISTRATION.step,
  CompetitionState.LIVE.step,
  CompetitionState.FINISHED.step,
]
