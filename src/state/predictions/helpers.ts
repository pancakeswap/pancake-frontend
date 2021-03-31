import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTIONS } from 'config/constants/endpoints'
import { BetPosition, PredictionStatus, Round, RoundData } from 'state/types'
import { getPredictionsContract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getRoundQuery, getRoundsQuery, RoundResponse } from './queries'

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
    bets,
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
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    bullBets: numberOrNull(bullBets),
    bearAmount: numberOrNull(bearAmount),
    bullAmount: numberOrNull(bullAmount),
    bets: bets.map((betResponse) => ({
      id: betResponse.id,
      hash: betResponse.hash,
      amount: betResponse.amount ? parseFloat(betResponse.amount) : 0,
      position: betResponse.position === 'Bull' ? BetPosition.BULL : BetPosition.BEAR,
      claimed: betResponse.claimed,
      user: {
        id: betResponse.user.id,
        address: betResponse.user.address,
        block: numberOrNull(betResponse.user.block),
        totalBets: numberOrNull(betResponse.user.totalBets),
        totalBNB: numberOrNull(betResponse.user.totalBNB),
      },
    })),
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

export const getRound = async (id: string) => {
  const response = await request(
    GRAPH_API_PREDICTIONS,
    gql`
      {
        ${getRoundQuery(id)}
      }
  `,
  )
  return response.round
}
