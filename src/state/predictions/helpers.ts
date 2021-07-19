import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTION } from 'config/constants/endpoints'
import { ethers } from 'ethers'
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
} from 'state/types'
import { multicallv2 } from 'utils/multicall'
import predictionsAbi from 'config/abi/predictions.json'
import { getPredictionsAddress } from 'utils/addressHelpers'
import { PredictionsClaimableResponse, PredictionsLedgerResponse, PredictionsRoundsResponse } from 'utils/types'
import {
  BetResponse,
  getRoundBaseFields,
  getBetBaseFields,
  getUserBaseFields,
  RoundResponse,
  TotalWonMarketResponse,
  TotalWonRoundResponse,
  UserResponse,
} from './queries'

export enum Result {
  WIN = 'win',
  LOSE = 'lose',
  CANCELED = 'canceled',
  LIVE = 'live',
}

export const numberOrNull = (value: string) => {
  if (value === null) {
    return null
  }

  const valueNum = Number(value)
  return Number.isNaN(valueNum) ? null : valueNum
}

export const transformUserResponse = (userResponse: UserResponse): PredictionUser => {
  const {
    id,
    createdAt,
    updatedAt,
    block,
    totalBets,
    totalBetsBear,
    totalBetsBull,
    totalBNBBear,
    totalBNBBull,
    totalBetsClaimed,
    totalBNBClaimed,
    winRate,
    averageBNB,
    netBNB,
    totalBNB,
  } = userResponse

  return {
    id,
    createdAt: numberOrNull(createdAt),
    updatedAt: numberOrNull(updatedAt),
    block: numberOrNull(block),
    totalBets: numberOrNull(totalBets),
    totalBetsBear: numberOrNull(totalBetsBear),
    totalBetsBull: numberOrNull(totalBetsBull),
    totalBNBBear: totalBNBBear ? parseFloat(totalBNBBear) : 0,
    totalBNBBull: totalBNBBull ? parseFloat(totalBNBBull) : 0,
    totalBetsClaimed: numberOrNull(totalBetsClaimed),
    totalBNBClaimed: totalBNBClaimed ? parseFloat(totalBNBClaimed) : 0,
    winRate: winRate ? parseFloat(winRate) : 0,
    averageBNB: averageBNB ? parseFloat(averageBNB) : 0,
    netBNB: netBNB ? parseFloat(netBNB) : 0,
    totalBNB: totalBNB ? parseFloat(totalBNB) : 0,
  }
}

const getRoundPosition = (positionResponse: string) => {
  if (positionResponse === 'Bull') {
    return BetPosition.BULL
  }

  if (positionResponse === 'Bear') {
    return BetPosition.BEAR
  }

  return null
}

export const transformBetResponse = (betResponse: BetResponse): Bet => {
  const {
    id,
    hash,
    amount,
    position,
    claimed,
    claimedAt,
    claimedHash,
    claimedBNB,
    claimedNetBNB,
    createdAt,
    updatedAt,
    block,
  } = betResponse

  const bet = {
    id,
    hash,
    claimed,
    claimedHash,
    amount: amount ? parseFloat(amount) : 0,
    claimedAt: numberOrNull(claimedAt),
    claimedBNB: claimedBNB ? parseFloat(claimedBNB) : 0,
    claimedNetBNB: claimedNetBNB ? parseFloat(claimedNetBNB) : 0,
    createdAt: numberOrNull(createdAt),
    updatedAt: numberOrNull(updatedAt),
    block: numberOrNull(block),
    position: getRoundPosition(position),
  } as Bet

  if (betResponse.round) {
    bet.round = transformRoundResponse(betResponse.round)
  }

  if (betResponse.user) {
    bet.user = transformUserResponse(betResponse.user)
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
    startHash,
    lockAt,
    lockBlock,
    lockPrice,
    lockHash,
    lockRoundId,
    closeAt,
    closePrice,
    closeBlock,
    closeRoundId,
    closeHash,
    totalBets,
    totalAmount,
    bullBets,
    bearBets,
    bearAmount,
    bullAmount,
    position,
    totalAmountTreasury,
    bets = [],
  } = roundResponse

  return {
    id,
    failed,
    closeRoundId,
    closeHash,
    lockHash,
    lockRoundId,
    startHash,
    epoch: numberOrNull(epoch),
    startBlock: numberOrNull(startBlock),
    startAt: numberOrNull(startAt),
    lockAt: numberOrNull(lockAt),
    lockBlock: numberOrNull(lockBlock),
    lockPrice: lockPrice ? parseFloat(lockPrice) : null,
    closeAt: numberOrNull(closeAt),
    closePrice: closePrice ? parseFloat(closePrice) : null,
    closeBlock: numberOrNull(closeBlock),
    totalBets: numberOrNull(totalBets),
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    totalAmountTreasury: totalAmountTreasury ? parseFloat(totalAmountTreasury) : 0,
    bullBets: numberOrNull(bullBets),
    bearBets: numberOrNull(bearBets),
    bearAmount: numberOrNull(bearAmount),
    bullAmount: numberOrNull(bullAmount),
    position: getRoundPosition(position),
    bets: bets.map(transformBetResponse),
  }
}

export const transformTotalWonResponse = (
  marketResponse: TotalWonMarketResponse,
  roundResponse: TotalWonRoundResponse[],
): number => {
  const houseRounds = roundResponse.reduce((accum, round) => {
    return accum + (round.totalAmount ? parseFloat(round.totalAmount) : 0)
  }, 0)

  const totalBNB = marketResponse.totalBNB ? parseFloat(marketResponse.totalBNB) : 0
  const totalBNBTreasury = marketResponse.totalBNBTreasury ? parseFloat(marketResponse.totalBNBTreasury) : 0

  return Math.max(totalBNB - (totalBNBTreasury + houseRounds), 0)
}

export const getRoundResult = (bet: Bet, currentEpoch: number): Result => {
  const { round } = bet
  if (round.failed) {
    return Result.CANCELED
  }

  if (round.epoch >= currentEpoch - 1) {
    return Result.LIVE
  }
  const roundResultPosition = round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR

  return bet.position === roundResultPosition ? Result.WIN : Result.LOSE
}

/**
 * Given a bet object, check if it is eligible to be claimed or refunded
 */
export const getCanClaim = (bet: Bet) => {
  return !bet.claimed && (bet.position === bet.round.position || bet.round.failed === true)
}

/**
 * Returns only bets where the user has won.
 * This is necessary because the API currently cannot distinguish between an uncliamed bet that has won or lost
 */
export const getUnclaimedWinningBets = (bets: Bet[]): Bet[] => {
  return bets.filter(getCanClaim)
}

export const getTotalWon = async (): Promise<number> => {
  const response = (await request(
    GRAPH_API_PREDICTION,
    gql`
      query getTotalWonData($position: String) {
        market(id: 1) {
          totalBNB
          totalBNBTreasury
        }
        rounds(where: { position: $position }) {
          totalAmount
        }
      }
    `,
    { position: BetPosition.HOUSE },
  )) as { market: TotalWonMarketResponse; rounds: TotalWonRoundResponse[] }

  return transformTotalWonResponse(response.market, response.rounds)
}

type BetHistoryWhereClause = Record<string, string | number | boolean | string[]>

export const getBetHistory = async (
  where: BetHistoryWhereClause = {},
  first = 1000,
  skip = 0,
): Promise<BetResponse[]> => {
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

// V2 REFACTOR
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

  // "claimable" currently has a bug where it returns true on Bull bets even if the wallet did not interact with the round
  // To get around this temporarily we check the ledger status as well to confirm that it is claimable
  // This can be removed in Predictions V2
  const ledgerResponses = await getLedgerData(account, epochs)

  return claimableResponses.reduce((accum, claimableResponse, index) => {
    const { amount, claimed } = ledgerResponses[index]
    const epoch = epochs[index]
    const [claimable] = claimableResponse

    return {
      ...accum,
      [epoch]: claimable && amount.gt(0) && !claimed,
    }
  }, {})
}

export type MarketData = Pick<
  PredictionsState,
  'status' | 'currentEpoch' | 'intervalSeconds' | 'minBetAmount' | 'roundBufferSeconds'
>
export const getPredictionData = async (): Promise<MarketData> => {
  const address = getPredictionsAddress()
  const staticCalls = ['currentEpoch', 'intervalSeconds', 'minBetAmount', 'paused', 'roundBufferSeconds'].map(
    (method) => ({
      address,
      name: method,
    }),
  )
  const [[currentEpoch], [intervalSeconds], [minBetAmount], [paused], [roundBufferSeconds]] = await multicallv2(
    predictionsAbi,
    staticCalls,
  )

  return {
    status: paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: currentEpoch.toNumber(),
    intervalSeconds: intervalSeconds.toNumber(),
    minBetAmount: minBetAmount.toString(),
    roundBufferSeconds: roundBufferSeconds.toNumber(),
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
    totalAmount: ethers.BigNumber.from(0).toJSON(),
    bullAmount: ethers.BigNumber.from(0).toJSON(),
    bearAmount: ethers.BigNumber.from(0).toJSON(),
    rewardBaseCalAmount: ethers.BigNumber.from(0).toJSON(),
    rewardAmount: ethers.BigNumber.from(0).toJSON(),
    priceResolved: false,
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
    priceResolved,
  } = response

  return {
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
    priceResolved,
  }
}

/**
 * Parse serialized values back into ethers.BigNumber
 * ethers.BigNumber values are stored with the "toJSJON()" method, e.g  { type: "BigNumber", hex: string }
 */
export const parseBigNumberObj = <T = Record<string, any>, K = Record<string, any>>(data: T): K => {
  return Object.keys(data).reduce((accum, key) => {
    const value = data[key]

    if (value && value?.type === 'BigNumber') {
      return {
        ...accum,
        [key]: ethers.BigNumber.from(value),
      }
    }

    return {
      ...accum,
      [key]: value,
    }
  }, {}) as K
}
