import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTIONS } from 'config/constants/endpoints'
import { PredictionStatus, Round, RoundData } from 'state/types'
import { getPredictionsContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getRoundsQuery, RoundResponse } from './queries'

const numberOrNull = (value: string) => {
  if (value === null) {
    return null
  }

  return Number(value)
}

export const generateIdFromEpoch = (epoch: number) => {
  return `0x${epoch.toString(16)}`
}

export const makeFutureRoundResponse = (epoch: number, startBlock: number): RoundResponse => {
  return {
    id: generateIdFromEpoch(epoch),
    epoch: epoch.toString(),
    startBlock: startBlock.toString(),
    lockAt: null,
    lockBlock: null,
    lockPrice: null,
    endBlock: null,
    closePrice: null,
    totalBets: '0',
    totalAmount: '0',
    bearBets: '0',
    bullBets: '0',
    bearAmount: '0',
    bullAmount: '0',
    bets: [],
  }
}

export const transformRoundResponse = (roundResponse: RoundResponse): Round => {
  const {
    id,
    epoch,
    startBlock,
    lockAt,
    lockBlock,
    lockPrice,
    endBlock,
    closePrice,
    totalBets,
    totalAmount,
    bullBets,
    bearAmount,
    bullAmount,
  } = roundResponse

  return {
    id,
    epoch: numberOrNull(epoch),
    startBlock: numberOrNull(startBlock),
    lockAt: numberOrNull(lockAt),
    lockBlock: numberOrNull(lockBlock),
    lockPrice: lockPrice ? parseFloat(lockPrice) : null,
    endBlock: numberOrNull(endBlock),
    closePrice: closePrice ? parseFloat(closePrice) : null,
    totalBets: numberOrNull(totalBets),
    totalAmount: lockPrice ? parseFloat(totalAmount) : null,
    bullBets: numberOrNull(bullBets),
    bearAmount: numberOrNull(bearAmount),
    bullAmount: numberOrNull(bullAmount),
  }
}

export const makeRoundData = (roundResponses: RoundResponse[]): RoundData => {
  return roundResponses.reduce((accum, roundResponse) => {
    return {
      ...accum,
      [roundResponse.id]: transformRoundResponse(roundResponse),
    }
  }, {})
}

/**
 * Gets static data from the contract
 */
export const getStaticPredictionsData = async () => {
  const { methods } = getPredictionsContract()
  const [currentEpoch, intervalBlocks, minBetAmount, isPaused, bufferBlocks] = await makeBatchRequest([
    methods.currentEpoch().call,
    methods.intervalBlocks().call,
    methods.minBetAmount().call,
    methods.paused().call,
    methods.bufferBlocks().call,
  ])

  return {
    status: isPaused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: Number(currentEpoch),
    intervalBlocks: Number(intervalBlocks),
    bufferBlocks: Number(bufferBlocks),
    minBetAmount,
  }
}

export const getLatestRounds = async () => {
  const response = await request(
    GRAPH_API_PREDICTIONS,
    gql`
      {
        ${getRoundsQuery()}
      }
  `,
  )
  return response.rounds
}
