import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTIONS } from 'config/constants/endpoints'
import { Bet, BetPosition, Market, PredictionStatus, Round, RoundData } from 'state/types'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getPredictionsContract } from 'utils/contractHelpers'
import {
  BetResponse,
  getRoundBaseFields,
  getBetBaseFields,
  getUserBaseFields,
  RoundResponse,
  MarketResponse,
} from './queries'

export const numberOrNull = (value: string) => {
  if (value === null) {
    return null
  }

  const valueNum = Number(value)
  return Number.isNaN(valueNum) ? null : valueNum
}

export const makeFutureRoundResponse = (epoch: number, startBlock: number): RoundResponse => {
  return {
    id: epoch.toString(),
    epoch: epoch.toString(),
    startBlock: startBlock.toString(),
    failed: null,
    startAt: null,
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
    position: null,
    bets: [],
  }
}

export const transformBetResponse = (betResponse: BetResponse): Bet => {
  const bet = {
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
  } as Bet

  if (betResponse.round) {
    bet.round = transformRoundResponse(betResponse.round)
  }

  return bet
}

export const transformRoundResponse = (roundResponse: RoundResponse): Round => {
  const {
    id,
    epoch,
    failed,
    startBlock,
    startAt,
    lockAt,
    lockBlock,
    lockPrice,
    endBlock,
    closePrice,
    totalBets,
    totalAmount,
    bullBets,
    bearBets,
    bearAmount,
    bullAmount,
    position,
    bets = [],
  } = roundResponse

  const getRoundPosition = (positionResponse: string) => {
    if (positionResponse === 'Bull') {
      return BetPosition.BULL
    }

    if (positionResponse === 'Bear') {
      return BetPosition.BEAR
    }

    return null
  }

  return {
    id,
    failed,
    epoch: numberOrNull(epoch),
    startBlock: numberOrNull(startBlock),
    startAt: numberOrNull(startAt),
    lockAt: numberOrNull(lockAt),
    lockBlock: numberOrNull(lockBlock),
    lockPrice: lockPrice ? parseFloat(lockPrice) : null,
    endBlock: numberOrNull(endBlock),
    closePrice: closePrice ? parseFloat(closePrice) : null,
    totalBets: numberOrNull(totalBets),
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    bullBets: numberOrNull(bullBets),
    bearBets: numberOrNull(bearBets),
    bearAmount: numberOrNull(bearAmount),
    bullAmount: numberOrNull(bullAmount),
    position: getRoundPosition(position),
    bets: bets.map(transformBetResponse),
  }
}

export const transformMarketResponse = (marketResponse: MarketResponse): Market => {
  return {
    id: marketResponse.id,
    paused: marketResponse.paused,
    epoch: Number(marketResponse.epoch.epoch),
  }
}

export const makeRoundData = (rounds: Round[]): RoundData => {
  return rounds.reduce((accum, round) => {
    return {
      ...accum,
      [round.id]: round,
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

export const getMarketData = async (): Promise<{
  rounds: Round[]
  market: Market
}> => {
  const response = (await request(
    GRAPH_API_PREDICTIONS,
    gql`
      query getMarketData {
        rounds(first: 5, orderBy: epoch, orderDirection: desc) {
          ${getRoundBaseFields()}
          bets(first: 1000) {
            ${getBetBaseFields()}
            user {
              ${getUserBaseFields()}
            }
          }
        }
        market(id: 1) {
          id
          paused
          epoch {
            epoch
          }
        }
      }
    `,
  )) as { rounds: RoundResponse[]; market: MarketResponse }

  return {
    rounds: response.rounds.map(transformRoundResponse),
    market: transformMarketResponse(response.market),
  }
}

export const getRound = async (id: string) => {
  const response = await request(
    GRAPH_API_PREDICTIONS,
    gql`
      query getRound($id: ID!) {
        round(id: $id) {
          ${getRoundBaseFields()}
          bets {
           ${getBetBaseFields()}
            user {
             ${getUserBaseFields()}
            }
          }
        }
      }
  `,
    { id },
  )
  return response.round
}

type BetHistoryWhereClause = Record<string, string | number | boolean>

export const getBetHistory = async (
  where: BetHistoryWhereClause = {},
  first = 100,
  skip = 0,
): Promise<BetResponse[]> => {
  const response = await request(
    GRAPH_API_PREDICTIONS,
    gql`
      query getBetHistory($first: Int!, $skip: Int!, $where: Bet_filter) {
        bets(first: $first, skip: $skip, where: $where) {
          ${getBetBaseFields()}
          round {
            ${getRoundBaseFields()}
          }
          user {
            ${getUserBaseFields()}
          } 
        }
      }
    `,
    { first, skip, where },
  )
  return response.bets
}

export const getBet = async (betId: string): Promise<BetResponse> => {
  const response = await request(
    GRAPH_API_PREDICTIONS,
    gql`
      query getBet($id: ID!) {
        bet(id: $id) {
          ${getBetBaseFields()}
          round {
            ${getRoundBaseFields()}
          }
          user {
            ${getUserBaseFields()}
          } 
        }
      }
  `,
    {
      id: betId.toLowerCase(),
    },
  )
  return response.bet
}
