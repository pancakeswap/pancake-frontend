import BigNumber from 'bignumber.js'
import { random } from 'lodash'
import { Round, RoundResponse } from 'state/types'

export const transformRoundResponse = (roundResponse: RoundResponse): Round => {
  const base = 23140409205
  const low = base * 0.95
  const high = base * 1.05
  const { totalAmount, rewardBaseCalAmount, rewardAmount, ...rest } = roundResponse

  return {
    ...rest,
    lockPrice: new BigNumber(random(low, high)),
    closePrice: new BigNumber(random(low, high)),
    totalAmount: new BigNumber(totalAmount),
    bullAmount: new BigNumber(random(500000000000000000000, 5000000000000000000000)),
    bearAmount: new BigNumber(random(500000000000000000000, 5000000000000000000000)),
    rewardBaseCalAmount: new BigNumber(rewardBaseCalAmount),
    rewardAmount: new BigNumber(rewardAmount),
  }
}

export const getRound = (epoch: number): Promise<RoundResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        epoch,
        startBlock: 6874205,
        lockBlock: 6874225,
        endBlock: 6874245,
        lockPrice: 23140409205,
        closePrice: 9,
        totalAmount: 0,
        bullAmount: 0,
        bearAmount: 0,
        rewardBaseCalAmount: 0,
        rewardAmount: 0,
        oracleCalled: false,
      })
    }, 300)
  })
}

export const getCurrentEpoch = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(95)
    }, 100)
  })
}

export const getPastRounds = async (roundsToGet = 5) => {
  const currentEpoch = await getCurrentEpoch()
  const oldestEpoch = currentEpoch - roundsToGet
  const roundPromises = []

  for (let i = currentEpoch; i >= oldestEpoch; i--) {
    roundPromises.push(getRound(i))
  }

  const rounds = (await Promise.all(roundPromises)) as Round[]

  return { currentEpoch, rounds }
}

export default getRound
