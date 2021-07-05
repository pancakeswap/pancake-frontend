import { request, gql } from 'graphql-request'
import { GRAPH_API_PREDICTION } from 'config/constants/endpoints'
import { ethers } from 'ethers'
import {
  Bet,
  BetDatav2,
  BetPosition,
  Market,
  PredictionsState,
  PredictionStatus,
  ReduxNodeLedger,
  ReduxNodeRound,
  Round,
  RoundData,
  RoundDataV2,
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
    claimedHash: betResponse.claimedHash,
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

export const makeRoundData = (rounds: Round[]): RoundData => {
  return rounds.reduce((accum, round) => {
    return {
      ...accum,
      [round.id]: round,
    }
  }, {})
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

type StaticPredictionsData = Pick<
  PredictionsState,
  'status' | 'currentEpoch' | 'intervalBlocks' | 'bufferBlocks' | 'minBetAmount' | 'rewardRate'
>

/**
 * Gets static data from the contract
 */
export const getStaticPredictionsData = async (): Promise<StaticPredictionsData> => {
  const calls = ['currentEpoch', 'intervalBlocks', 'minBetAmount', 'paused', 'bufferBlocks', 'rewardRate'].map(
    (method) => ({
      address: getPredictionsAddress(),
      name: method,
    }),
  )
  const [[currentEpoch], [intervalBlocks], [minBetAmount], [isPaused], [bufferBlocks], [rewardRate]] =
    await multicallv2(predictionsAbi, calls)

  return {
    status: isPaused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: currentEpoch.toNumber(),
    intervalBlocks: intervalBlocks.toNumber(),
    bufferBlocks: bufferBlocks.toNumber(),
    minBetAmount: minBetAmount.toString(),
    rewardRate: rewardRate.toNumber(),
  }
}

export const getMarketData = async (): Promise<{
  rounds: Round[]
  market: Market
}> => {
  const [[paused], [currentEpoch]] = (await multicallv2(
    predictionsAbi,
    ['paused', 'currentEpoch'].map((name) => ({
      address: getPredictionsAddress(),
      name,
    })),
  )) as [[boolean], [ethers.BigNumber]]

  const response = (await request(
    GRAPH_API_PREDICTION,
    gql`
      query getMarketData {
        rounds(first: 5, orderBy: epoch, orderDirection: desc) {
          ${getRoundBaseFields()}
        }
      }
    `,
  )) as { rounds: RoundResponse[] }

  return {
    rounds: response.rounds.map(transformRoundResponse),
    market: {
      epoch: currentEpoch.toNumber(),
      paused,
    },
  }
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

export const getRound = async (id: string) => {
  const response = await request(
    GRAPH_API_PREDICTION,
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
    const { amount } = ledgerResponses[index]
    const epoch = epochs[index]
    const [claimable] = claimableResponse

    return {
      ...accum,
      [epoch]: claimable && amount.gt(0),
    }
  }, {})
}

export type MarketData = Pick<
  PredictionsState,
  'status' | 'currentEpoch' | 'intervalBlocks' | 'bufferBlocks' | 'minBetAmount' | 'rewardRate'
>
export const getPredictionData = async (): Promise<MarketData> => {
  const address = getPredictionsAddress()
  const staticCalls = ['currentEpoch', 'intervalBlocks', 'minBetAmount', 'paused', 'bufferBlocks', 'rewardRate'].map(
    (method) => ({
      address,
      name: method,
    }),
  )
  const [[currentEpoch], [intervalBlocks], [minBetAmount], [paused], [bufferBlocks], [rewardRate]] = await multicallv2(
    predictionsAbi,
    staticCalls,
  )

  return {
    status: paused ? PredictionStatus.PAUSED : PredictionStatus.LIVE,
    currentEpoch: currentEpoch.toNumber(),
    intervalBlocks: intervalBlocks.toNumber(),
    bufferBlocks: bufferBlocks.toNumber(),
    minBetAmount: minBetAmount.toString(),
    rewardRate: rewardRate.toNumber(),
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

export const makeFutureRoundResponsev2 = (epoch: number, startBlock: number): ReduxNodeRound => {
  return {
    epoch,
    startBlock,
    lockBlock: null,
    endBlock: null,
    lockPrice: null,
    closePrice: null,
    totalAmount: ethers.BigNumber.from(0).toJSON(),
    bullAmount: ethers.BigNumber.from(0).toJSON(),
    bearAmount: ethers.BigNumber.from(0).toJSON(),
    rewardBaseCalAmount: ethers.BigNumber.from(0).toJSON(),
    rewardAmount: ethers.BigNumber.from(0).toJSON(),
    oracleCalled: false,
  }
}

export const makeRoundDataV2 = (rounds: ReduxNodeRound[]): RoundDataV2 => {
  return rounds.reduce((accum, round) => {
    return {
      ...accum,
      [round.epoch.toString()]: round,
    }
  }, {})
}

export const serializePredictionsLedgerResponse = (ledgerResponse: PredictionsLedgerResponse): ReduxNodeLedger => ({
  position: ledgerResponse.position === 0 ? BetPosition.BEAR : BetPosition.BEAR,
  amount: ledgerResponse.amount.toJSON(),
  claimed: ledgerResponse.claimed,
})

export const makeLedgerData = (account: string, ledgers: PredictionsLedgerResponse[], epochs: number[]): BetDatav2 => {
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

export const serializePredictionsRoundsResponse = (response: PredictionsRoundsResponse) => {
  const {
    epoch,
    startBlock,
    lockBlock,
    endBlock,
    lockPrice,
    closePrice,
    totalAmount,
    bullAmount,
    bearAmount,
    rewardAmount,
    oracleCalled,
  } = response

  return {
    epoch: epoch.toNumber(),
    startBlock: startBlock.toNumber(),
    lockBlock: lockBlock.toNumber(),
    endBlock: endBlock.toNumber(),
    lockPrice: lockPrice.eq(0) ? null : lockPrice.toJSON(),
    closePrice: closePrice.eq(0) ? null : lockPrice.toJSON(),
    totalAmount: totalAmount.toJSON(),
    bullAmount: bullAmount.toJSON(),
    bearAmount: bearAmount.toJSON(),
    rewardAmount: rewardAmount.toJSON(),
    oracleCalled,
  } as ReduxNodeRound
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

// END V2 REFACTOR
