import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTION } from 'config/constants/endpoints'
import { BigNumber } from '@ethersproject/bignumber'
import {
  Bet,
  LedgerData,
  BetPosition,
  PredictionsState,
  PredictionStatus,
  ReduxNodeLedger,
  ReduxNodeRound,
  Round,
  RoundData,
  PredictionUser,
  HistoryFilter,
} from 'state/types'
import { multicallv2 } from 'utils/multicall'
import { getPredictionsContract } from 'utils/contractHelpers'
import predictionsAbi from 'config/abi/predictions.json'
import { getPredictionsAddress } from 'utils/addressHelpers'
import { Zero } from '@ethersproject/constants'
import { PredictionsClaimableResponse, PredictionsLedgerResponse, PredictionsRoundsResponse } from 'utils/types'
import {
  BetResponse,
  getRoundBaseFields,
  getBetBaseFields,
  getUserBaseFields,
  RoundResponse,
  TotalWonMarketResponse,
  UserResponse,
} from './queries'
import { ROUNDS_PER_PAGE } from './config'

export enum Result {
  WIN = 'win',
  LOSE = 'lose',
  CANCELED = 'canceled',
  HOUSE = 'house',
  LIVE = 'live',
}

export const numberOrNull = (value: string) => {
  if (value === null) {
    return null
  }

  const valueNum = Number(value)
  return Number.isNaN(valueNum) ? null : valueNum
}

const getRoundPosition = (positionResponse: string) => {
  if (positionResponse === 'Bull') {
    return BetPosition.BULL
  }

  if (positionResponse === 'Bear') {
    return BetPosition.BEAR
  }

  if (positionResponse === 'House') {
    return BetPosition.HOUSE
  }

  return null
}

export const transformBetResponse = (betResponse: BetResponse): Bet => {
  const bet = {
    id: betResponse.id,
    hash: betResponse.hash,
    block: numberOrNull(betResponse.block),
    amount: betResponse.amount ? parseFloat(betResponse.amount) : 0,
    position: betResponse.position === 'Bull' ? BetPosition.BULL : BetPosition.BEAR,
    claimed: betResponse.claimed,
    claimedAt: numberOrNull(betResponse.claimedAt),
    claimedBlock: numberOrNull(betResponse.claimedBlock),
    claimedHash: betResponse.claimedHash,
    claimedBNB: betResponse.claimedBNB ? parseFloat(betResponse.claimedBNB) : 0,
    claimedNetBNB: betResponse.claimedNetBNB ? parseFloat(betResponse.claimedNetBNB) : 0,
    createdAt: numberOrNull(betResponse.createdAt),
    updatedAt: numberOrNull(betResponse.updatedAt),
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponse(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponse(betResponse.round)
  }

  return bet
}

export const transformUserResponse = (userResponse: UserResponse): PredictionUser => {
  const {
    id,
    createdAt,
    updatedAt,
    block,
    totalBets,
    totalBetsBull,
    totalBetsBear,
    totalBNB,
    totalBNBBull,
    totalBNBBear,
    totalBetsClaimed,
    totalBNBClaimed,
    winRate,
    averageBNB,
    netBNB,
  } = userResponse

  return {
    id,
    createdAt: numberOrNull(createdAt),
    updatedAt: numberOrNull(updatedAt),
    block: numberOrNull(block),
    totalBets: numberOrNull(totalBets),
    totalBetsBull: numberOrNull(totalBetsBull),
    totalBetsBear: numberOrNull(totalBetsBear),
    totalBNB: totalBNB ? parseFloat(totalBNB) : 0,
    totalBNBBull: totalBNBBull ? parseFloat(totalBNBBull) : 0,
    totalBNBBear: totalBNBBear ? parseFloat(totalBNBBear) : 0,
    totalBetsClaimed: numberOrNull(totalBetsClaimed),
    totalBNBClaimed: totalBNBClaimed ? parseFloat(totalBNBClaimed) : 0,
    winRate: winRate ? parseFloat(winRate) : 0,
    averageBNB: averageBNB ? parseFloat(averageBNB) : 0,
    netBNB: netBNB ? parseFloat(netBNB) : 0,
  }
}

export const transformRoundResponse = (roundResponse: RoundResponse): Round => {
  const {
    id,
    epoch,
    failed,
    position,
    startAt,
    startBlock,
    startHash,
    lockAt,
    lockBlock,
    lockHash,
    lockPrice,
    lockRoundId,
    closeAt,
    closeBlock,
    closeHash,
    closePrice,
    closeRoundId,
    totalBets,
    totalAmount,
    bullBets,
    bullAmount,
    bearBets,
    bearAmount,
    bets = [],
  } = roundResponse

  return {
    id,
    failed,
    startHash,
    lockHash,
    lockRoundId,
    closeRoundId,
    closeHash,
    position: getRoundPosition(position),
    epoch: numberOrNull(epoch),
    startAt: numberOrNull(startAt),
    startBlock: numberOrNull(startBlock),
    lockAt: numberOrNull(lockAt),
    lockBlock: numberOrNull(lockBlock),
    lockPrice: lockPrice ? parseFloat(lockPrice) : 0,
    closeAt: numberOrNull(closeAt),
    closeBlock: numberOrNull(closeBlock),
    closePrice: closePrice ? parseFloat(closePrice) : 0,
    totalBets: numberOrNull(totalBets),
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    bullBets: numberOrNull(bullBets),
    bullAmount: bullAmount ? parseFloat(bullAmount) : 0,
    bearBets: numberOrNull(bearBets),
    bearAmount: bearAmount ? parseFloat(bearAmount) : 0,
    bets: bets.map(transformBetResponse),
  }
}

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

export const getTotalWon = async (): Promise<number> => {
  const { market } = (await request(
    GRAPH_API_PREDICTION,
    gql`
      query getTotalWonData {
        market(id: 1) {
          totalBNB
          totalBNBTreasury
        }
      }
    `,
  )) as { market: TotalWonMarketResponse }

  const totalBNB = market.totalBNB ? parseFloat(market.totalBNB) : 0
  const totalBNBTreasury = market.totalBNBTreasury ? parseFloat(market.totalBNBTreasury) : 0

  return Math.max(totalBNB - totalBNBTreasury, 0)
}

type WhereClause = Record<string, string | number | boolean | string[]>

export const getBetHistory = async (where: WhereClause = {}, first = 1000, skip = 0): Promise<BetResponse[]> => {
  const response = await request(
    GRAPH_API_PREDICTION,
    gql`
      query getBetHistory($first: Int!, $skip: Int!, $where: Bet_filter) {
        bets(first: $first, skip: $skip, where: $where, order: createdAt, orderDirection: desc) {
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
    GRAPH_API_PREDICTION,
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

export const getLedgerData = async (account: string, epochs: number[]) => {
  const address = getPredictionsAddress()
  const ledgerCalls = epochs.map((epoch) => ({
    address,
    name: 'ledger',
    params: [epoch, account],
  }))
  const response = await multicallv2<PredictionsLedgerResponse[]>(predictionsAbi, ledgerCalls)
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

export const getPredictionUsers = async (options: GetPredictionUsersOptions = {}): Promise<UserResponse[]> => {
  const { first, skip, where, orderBy, orderDir } = { ...defaultPredictionUserOptions, ...options }
  const response = await request(
    GRAPH_API_PREDICTION,
    gql`
      query getUsers($first: Int!, $skip: Int!, $where: User_filter, $orderBy: User_orderBy, $orderDir: OrderDirection) {
        users(first: $first, skip: $skip, where: $where, orderBy: $orderBy, orderDirection: $orderDir) {
          ${getUserBaseFields()}
        }
      }
    `,
    { first, skip, where, orderBy, orderDir },
  )
  return response.users
}

export const getPredictionUser = async (account: string): Promise<UserResponse> => {
  const response = await request(
    GRAPH_API_PREDICTION,
    gql`
      query getUser($id: ID!) {
        user(id: $id) {
          ${getUserBaseFields()}
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
): Promise<PredictionsState['claimableStatuses']> => {
  const address = getPredictionsAddress()
  const claimableCalls = epochs.map((epoch) => ({
    address,
    name: 'claimable',
    params: [epoch, account],
  }))
  const claimableResponses = await multicallv2<[PredictionsClaimableResponse][]>(predictionsAbi, claimableCalls)

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
export const getPredictionData = async (): Promise<MarketData> => {
  const address = getPredictionsAddress()
  const staticCalls = ['currentEpoch', 'intervalSeconds', 'minBetAmount', 'paused'].map((method) => ({
    address,
    name: method,
  }))
  const [[currentEpoch], [intervalSeconds], [minBetAmount], [paused]] = await multicallv2(predictionsAbi, staticCalls)

  return {
    status: paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: currentEpoch.toNumber(),
    intervalSeconds: intervalSeconds.toNumber(),
    minBetAmount: minBetAmount.toString(),
  }
}

export const getRoundsData = async (epochs: number[]): Promise<PredictionsRoundsResponse[]> => {
  const address = getPredictionsAddress()
  const calls = epochs.map((epoch) => ({
    address,
    name: 'rounds',
    params: [epoch],
  }))
  const response = await multicallv2<PredictionsRoundsResponse[]>(predictionsAbi, calls)
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

export const fetchUsersRoundsLength = async (account: string) => {
  try {
    const contract = getPredictionsContract()
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
): Promise<{ [key: string]: ReduxNodeLedger }> => {
  const contract = getPredictionsContract()

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
