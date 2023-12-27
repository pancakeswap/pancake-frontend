import { BetPosition } from '@pancakeswap/prediction'
import numberOrNull from 'utils/numberOrNull'
import { Bet, PredictionUser, Round } from '../types'
import { BetResponseBNB } from './bnbQueries'
import { BetResponseCAKE } from './cakeQueries'
import { NewBetResponse } from './newTokenQueries'
import { RoundResponse } from './responseType'

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

export const transformRoundResponseToken = (
  roundResponse: RoundResponse<BetResponseCAKE | BetResponseBNB | NewBetResponse>,
  transformBetResponse: (betResponse: any) => Bet,
): Round => {
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
    position: getRoundPosition(position) || BetPosition.HOUSE,
    epoch: numberOrNull(epoch) ?? 0,
    startAt: numberOrNull(startAt) ?? 0,
    startBlock: numberOrNull(startBlock) ?? 0,
    lockAt: numberOrNull(lockAt) ?? 0,
    lockBlock: numberOrNull(lockBlock) ?? 0,
    lockPrice: lockPrice ? parseFloat(lockPrice) : 0,
    closeAt: numberOrNull(closeAt) ?? 0,
    closeBlock: numberOrNull(closeBlock) ?? 0,
    closePrice: closePrice ? parseFloat(closePrice) : 0,
    totalBets: numberOrNull(totalBets) ?? 0,
    totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
    bullBets: numberOrNull(bullBets) ?? 0,
    bullAmount: bullAmount ? parseFloat(bullAmount) : 0,
    bearBets: numberOrNull(bearBets) ?? 0,
    bearAmount: bearAmount ? parseFloat(bearAmount) : 0,
    bets: bets.map(transformBetResponse),
  }
}

export const transformBetResponseToken = (betResponse): Bet => {
  return {
    id: betResponse.id,
    hash: betResponse.hash,
    block: numberOrNull(betResponse.block),
    amount: betResponse.amount ? parseFloat(betResponse.amount) : 0,
    position: betResponse.position === 'Bull' ? BetPosition.BULL : BetPosition.BEAR,
    claimed: betResponse.claimed,
    claimedAt: numberOrNull(betResponse.claimedAt),
    claimedBlock: numberOrNull(betResponse.claimedBlock),
    claimedHash: betResponse.claimedHash,
    createdAt: numberOrNull(betResponse.createdAt),
    updatedAt: numberOrNull(betResponse.updatedAt),
    claimedNetBNB: betResponse.amount ? parseFloat(betResponse.claimedNetAmount) : 0,
    claimedBNB: betResponse.amount ? parseFloat(betResponse.claimedAmount) : 0,
  } as Bet
}

export const transformUserResponseToken = (userResponse): PredictionUser => {
  const { id, createdAt, updatedAt, block, totalBets, totalBetsBull, totalBetsBear, totalBetsClaimed, winRate } =
    userResponse || {}

  return {
    id,
    createdAt: numberOrNull(createdAt) ?? 0,
    updatedAt: numberOrNull(updatedAt) ?? 0,
    block: numberOrNull(block) ?? 0,
    totalBets: numberOrNull(totalBets) ?? 0,
    totalBetsBull: numberOrNull(totalBetsBull) ?? 0,
    totalBetsBear: numberOrNull(totalBetsBear) ?? 0,
    totalBetsClaimed: numberOrNull(totalBetsClaimed) ?? 0,
    winRate: winRate ? parseFloat(winRate) : 0,
    totalBNB: 0,
    totalBNBBull: 0,
    totalBNBBear: 0,
    totalBNBClaimed: 0,
    averageBNB: 0,
    netBNB: 0,
  }
}
