import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTION_BNB, GRAPH_API_PREDICTION_CAKE } from 'config/constants/endpoints'
import { BigNumber } from '@ethersproject/bignumber'
import {
  Bet,
  LedgerData,
  BetPosition,
  PredictionsState,
  PredictionStatus,
  ReduxNodeLedger,
  ReduxNodeRound,
  RoundData,
  HistoryFilter,
} from 'state/types'
import { multicallv2 } from 'utils/multicall'
import { getPredictionsContract } from 'utils/contractHelpers'
import predictionsAbi from 'config/abi/predictions.json'
import { Zero } from '@ethersproject/constants'
import { PredictionsClaimableResponse, PredictionsLedgerResponse, PredictionsRoundsResponse } from 'utils/types'
import { getRoundBaseFields, getBetBaseFields, getUserBaseFields } from './queries'
import { ROUNDS_PER_PAGE } from './config'
import { transformBetResponseCAKE, transformUserResponseCAKE } from './cakeTransformers'
import { transformBetResponseBNB, transformUserResponseBNB } from './bnbTransformers'
import { BetResponse, UserResponse } from './responseType'
import { BetResponseBNB } from './bnbQueries'
import { BetResponseCAKE } from './cakeQueries'

export enum Result {
  WIN = 'win',
  LOSE = 'lose',
  CANCELED = 'canceled',
  HOUSE = 'house',
  LIVE = 'live',
}

export const transformBetResponse = (tokenSymbol) =>
  tokenSymbol === 'CAKE' ? transformBetResponseCAKE : transformBetResponseBNB

export const transformUserResponse = (tokenSymbol) =>
  tokenSymbol === 'CAKE' ? transformUserResponseCAKE : transformUserResponseBNB

export const getRoundResult = (bet: Bet, currentEpoch: number): Result => {
  const { round } = bet
  if (round.failed) {
    return Result.CANCELED
  }

  if (round.epoch >= currentEpoch - 1) {
    return Result.LIVE
  }

  if (bet.round.position === BetPosition.HOUSE) {
    return Result.HOUSE
  }

  const roundResultPosition = round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR

  return bet.position === roundResultPosition ? Result.WIN : Result.LOSE
}

export const getFilteredBets = (bets: Bet[], filter: HistoryFilter) => {
  switch (filter) {
    case HistoryFilter.COLLECTED:
      return bets.filter((bet) => bet.claimed === true)
    case HistoryFilter.UNCOLLECTED:
      return bets.filter((bet) => {
        return !bet.claimed && (bet.position === bet.round.position || bet.round.failed === true)
      })
    case HistoryFilter.ALL:
    default:
      return bets
  }
}

const getTotalWonMarket = (market, tokenSymbol) => {
  const total = market[`total${tokenSymbol}`] ? parseFloat(market[`total${tokenSymbol}`]) : 0
  const totalTreasury = market[`total${tokenSymbol}Treasury`] ? parseFloat(market[`total${tokenSymbol}Treasury`]) : 0

  return Math.max(total - totalTreasury, 0)
}

export const getTotalWon = async (): Promise<{ totalWonBNB: number; totalWonCAKE: number }> => {
  const [{ market: BNBMarket, market: CAKEMarket }] = await Promise.all([
    request(
      GRAPH_API_PREDICTION_BNB,
      gql`
        query getTotalWonData {
          market(id: 1) {
            totalBNB
            totalBNBTreasury
          }
        }
      `,
    ),
    request(
      GRAPH_API_PREDICTION_CAKE,
      gql`
        query getTotalWonData {
          market(id: 1) {
            totalCAKE
            totalCAKETreasury
          }
        }
      `,
    ),
  ])

  const totalWonBNB = getTotalWonMarket(BNBMarket, 'BNB')
  const totalWonCAKE = getTotalWonMarket(CAKEMarket, 'CAKE')

  return { totalWonBNB, totalWonCAKE }
}

type WhereClause = Record<string, string | number | boolean | string[]>

export const getBetHistory = async (
  where: WhereClause = {},
  first = 1000,
  skip = 0,
  api: string,
  tokenSymbol: string,
): Promise<Array<BetResponseBNB | BetResponseCAKE>> => {
  const response = await request(
    api,
    gql`
      query getBetHistory($first: Int!, $skip: Int!, $where: Bet_filter) {
        bets(first: $first, skip: $skip, where: $where, order: createdAt, orderDirection: desc) {
          ${getBetBaseFields(tokenSymbol)}
          round {
            ${getRoundBaseFields(tokenSymbol)}
          }
          user {
            ${getUserBaseFields(tokenSymbol)}
          }
        }
      }
    `,
    { first, skip, where },
  )
  return response.bets
}

export const getLedgerData = async (account: string, epochs: number[], address: string) => {
  const ledgerCalls = epochs.map((epoch) => ({
    address,
    name: 'ledger',
    params: [epoch, account],
  }))
  const response = await multicallv2<PredictionsLedgerResponse[]>({ abi: predictionsAbi, calls: ledgerCalls })
  return response
}

export const LEADERBOARD_RESULTS_PER_PAGE = 20

interface GetPredictionUsersOptions {
  skip?: number
  first?: number
  orderBy?: string
  orderDir?: string
  where?: WhereClause
}

const defaultPredictionUserOptions = {
  skip: 0,
  first: LEADERBOARD_RESULTS_PER_PAGE,
  orderBy: 'createdAt',
  orderDir: 'desc',
}

export const getHasRoundFailed = (oracleCalled: boolean, closeTimestamp: number, buffer: number) => {
  if (!oracleCalled) {
    const closeTimestampMs = (closeTimestamp + buffer) * 1000
    if (Number.isFinite(closeTimestampMs)) {
      return Date.now() > closeTimestampMs
    }
  }

  return false
}

export const getPredictionUsers = async (
  options: GetPredictionUsersOptions = {},
  api: string,
  tokenSymbol: string,
): Promise<UserResponse<BetResponse>[]> => {
  const { first, skip, where, orderBy, orderDir } = { ...defaultPredictionUserOptions, ...options }
  const response = await request(
    api,
    gql`
      query getUsers($first: Int!, $skip: Int!, $where: User_filter, $orderBy: User_orderBy, $orderDir: OrderDirection) {
        users(first: $first, skip: $skip, where: $where, orderBy: $orderBy, orderDirection: $orderDir) {
          ${getUserBaseFields(tokenSymbol)}
        }
      }
    `,
    { first, skip, where, orderBy, orderDir },
  )
  return response.users
}

export const getPredictionUser = async (
  account: string,
  api: string,
  tokenSymbol: string,
): Promise<UserResponse<BetResponse>> => {
  const response = await request(
    api,
    gql`
      query getUser($id: ID!) {
        user(id: $id) {
          ${getUserBaseFields(tokenSymbol)}
        }
      }
  `,
    {
      id: account.toLowerCase(),
    },
  )
  return response.user
}

export const getClaimStatuses = async (
  account: string,
  epochs: number[],
  address: string,
): Promise<PredictionsState['claimableStatuses']> => {
  const claimableCalls = epochs.map((epoch) => ({
    address,
    name: 'claimable',
    params: [epoch, account],
  }))
  const claimableResponses = await multicallv2<[PredictionsClaimableResponse][]>({
    abi: predictionsAbi,
    calls: claimableCalls,
  })

  return claimableResponses.reduce((accum, claimableResponse, index) => {
    const epoch = epochs[index]
    const [claimable] = claimableResponse

    return {
      ...accum,
      [epoch]: claimable,
    }
  }, {})
}

export type MarketData = Pick<PredictionsState, 'status' | 'currentEpoch' | 'intervalSeconds' | 'minBetAmount'>
export const getPredictionData = async (address: string): Promise<MarketData> => {
  const staticCalls = ['currentEpoch', 'intervalSeconds', 'minBetAmount', 'paused'].map((method) => ({
    address,
    name: method,
  }))
  const [[currentEpoch], [intervalSeconds], [minBetAmount], [paused]] = await multicallv2({
    abi: predictionsAbi,
    calls: staticCalls,
  })

  return {
    status: paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: currentEpoch.toNumber(),
    intervalSeconds: intervalSeconds.toNumber(),
    minBetAmount: minBetAmount.toString(),
  }
}

export const getRoundsData = async (epochs: number[], address: string): Promise<PredictionsRoundsResponse[]> => {
  const calls = epochs.map((epoch) => ({
    address,
    name: 'rounds',
    params: [epoch],
  }))
  const response = await multicallv2<PredictionsRoundsResponse[]>({ abi: predictionsAbi, calls })
  return response
}

export const makeFutureRoundResponse = (epoch: number, startTimestamp: number): ReduxNodeRound => {
  return {
    epoch,
    startTimestamp,
    lockTimestamp: null,
    closeTimestamp: null,
    lockPrice: null,
    closePrice: null,
    totalAmount: Zero.toJSON(),
    bullAmount: Zero.toJSON(),
    bearAmount: Zero.toJSON(),
    rewardBaseCalAmount: Zero.toJSON(),
    rewardAmount: Zero.toJSON(),
    oracleCalled: false,
    lockOracleId: null,
    closeOracleId: null,
  }
}

export const makeRoundData = (rounds: ReduxNodeRound[]): RoundData => {
  return rounds.reduce((accum, round) => {
    return {
      ...accum,
      [round.epoch.toString()]: round,
    }
  }, {})
}

export const serializePredictionsLedgerResponse = (ledgerResponse: PredictionsLedgerResponse): ReduxNodeLedger => ({
  position: ledgerResponse.position === 0 ? BetPosition.BULL : BetPosition.BEAR,
  amount: ledgerResponse.amount.toJSON(),
  claimed: ledgerResponse.claimed,
})

export const makeLedgerData = (account: string, ledgers: PredictionsLedgerResponse[], epochs: number[]): LedgerData => {
  return ledgers.reduce((accum, ledgerResponse, index) => {
    if (!ledgerResponse) {
      return accum
    }

    // If the amount is zero that means the user did not bet
    if (ledgerResponse.amount.eq(0)) {
      return accum
    }

    const epoch = epochs[index].toString()

    return {
      ...accum,
      [account]: {
        ...accum[account],
        [epoch]: serializePredictionsLedgerResponse(ledgerResponse),
      },
    }
  }, {})
}

/**
 * Serializes the return from the "rounds" call for redux
 */
export const serializePredictionsRoundsResponse = (response: PredictionsRoundsResponse): ReduxNodeRound => {
  const {
    epoch,
    startTimestamp,
    lockTimestamp,
    closeTimestamp,
    lockPrice,
    closePrice,
    totalAmount,
    bullAmount,
    bearAmount,
    rewardBaseCalAmount,
    rewardAmount,
    oracleCalled,
    lockOracleId,
    closeOracleId,
  } = response

  return {
    oracleCalled,
    epoch: epoch.toNumber(),
    startTimestamp: startTimestamp.eq(0) ? null : startTimestamp.toNumber(),
    lockTimestamp: lockTimestamp.eq(0) ? null : lockTimestamp.toNumber(),
    closeTimestamp: closeTimestamp.eq(0) ? null : closeTimestamp.toNumber(),
    lockPrice: lockPrice.eq(0) ? null : lockPrice.toJSON(),
    closePrice: closePrice.eq(0) ? null : closePrice.toJSON(),
    totalAmount: totalAmount.toJSON(),
    bullAmount: bullAmount.toJSON(),
    bearAmount: bearAmount.toJSON(),
    rewardBaseCalAmount: rewardBaseCalAmount.toJSON(),
    rewardAmount: rewardAmount.toJSON(),
    lockOracleId: lockOracleId.toString(),
    closeOracleId: closeOracleId.toString(),
  }
}

/**
 * Parse serialized values back into BigNumber
 * BigNumber values are stored with the "toJSON()" method, e.g  { type: "BigNumber", hex: string }
 */
export const parseBigNumberObj = <T = Record<string, any>, K = Record<string, any>>(data: T): K => {
  return Object.keys(data).reduce((accum, key) => {
    const value = data[key]

    if (value && value?.type === 'BigNumber') {
      return {
        ...accum,
        [key]: BigNumber.from(value),
      }
    }

    return {
      ...accum,
      [key]: value,
    }
  }, {}) as K
}

export const fetchUsersRoundsLength = async (account: string, address: string) => {
  try {
    const contract = getPredictionsContract(address)
    const length = await contract.getUserRoundsLength(account)
    return length
  } catch {
    return Zero
  }
}

/**
 * Fetches rounds a user has participated in
 */
export const fetchUserRounds = async (
  account: string,
  cursor = 0,
  size = ROUNDS_PER_PAGE,
  address,
): Promise<{ [key: string]: ReduxNodeLedger }> => {
  const contract = getPredictionsContract(address)

  try {
    const [rounds, ledgers] = await contract.getUserRounds(account, cursor, size)

    return rounds.reduce((accum, round, index) => {
      return {
        ...accum,
        [round.toString()]: serializePredictionsLedgerResponse(ledgers[index] as PredictionsLedgerResponse),
      }
    }, {})
  } catch {
    // When the results run out the contract throws an error.
    return null
  }
}
