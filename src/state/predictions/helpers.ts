import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTIONS } from 'config/constants/endpoints'
import { PredictionStatus, Round } from 'state/types'
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

export const initialize = async () => {
  const { methods } = getPredictionsContract()
  const [currentEpoch, intervalBlocks, minBetAmount, isPaused] = (await makeBatchRequest([
    methods.currentEpoch().call,
    methods.intervalBlocks().call,
    methods.minBetAmount().call,
    methods.paused().call,
  ])) as [string, string, string, boolean]
  const response = await request(
    GRAPH_API_PREDICTIONS,
    gql`
    {
      ${getRoundsQuery()}
    }
  `,
  )

  const rounds = response.rounds.map(transformRoundResponse)

  return {
    status: isPaused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: Number(currentEpoch),
    intervalBlocks: Number(intervalBlocks),
    minBetAmount,
    rounds,
  }
}
