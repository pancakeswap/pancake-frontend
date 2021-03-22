import BigNumber from 'bignumber.js'
import { random } from 'lodash'
import { Round, RoundResponse } from 'state/types'

const currentBlock = 5897885
const totalRate = 100

export const transformRoundResponse = (roundResponse: RoundResponse): Round => {
  const base = 23140409205
  const low = base * 0.9
  const high = base * 1.15
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
        startBlock: 5893994,
        lockBlock: 5894000,
        endBlock: currentBlock + totalRate,
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
      resolve(4)
    }, 100)
  })
}

export const makeRound = (epoch: number, startBlock: number, endBlock: number): RoundResponse => ({
  epoch,
  startBlock,
  endBlock,
  lockBlock: 0,
  lockPrice: 0,
  closePrice: 0,
  totalAmount: 0,
  bullAmount: 0,
  bearAmount: 0,
  rewardBaseCalAmount: 0,
  rewardAmount: 0,
  oracleCalled: false,
})

export const getInitialRounds = async () => {
  const currentEpoch = await getCurrentEpoch()
  const rounds = []

  let startBlock = currentBlock - 7 * totalRate
  for (let i = 1; i <= 7; i++) {
    const endBlock = startBlock + totalRate
    rounds.push(makeRound(i, startBlock, endBlock))
    startBlock = currentBlock - i * totalRate
  }

  return { currentEpoch, rounds }
}

export default getRound
