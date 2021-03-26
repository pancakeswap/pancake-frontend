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

export const transformRoundResponse = (roundResponse: RoundResponse): Round => {
  const {
    id,
    epoch,
    startedAt,
    startBlock,
    lockAt,
    lockBlock,
    lockPrice,
    endAt,
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
    startedAt: numberOrNull(startedAt),
    startBlock: numberOrNull(startBlock),
    lockAt: numberOrNull(lockAt),
    lockBlock: numberOrNull(lockBlock),
    lockPrice: lockPrice ? parseFloat(lockPrice) : null,
    endAt: numberOrNull(endAt),
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
 * Gets static data from the contract that will not change
 */
export const getStaticPredictionsData = async () => {
  const { methods } = getPredictionsContract()
  const [currentEpoch, intervalBlocks, minBetAmount, isPaused] = await makeBatchRequest([
    methods.currentEpoch().call,
    methods.intervalBlocks().call,
    methods.minBetAmount().call,
    methods.paused().call,
  ])

  return {
    status: isPaused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: Number(currentEpoch),
    intervalBlocks: Number(intervalBlocks),
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
