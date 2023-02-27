import numberOrNull from 'utils/numberOrNull'
import { BetPosition, Bet, Round, PredictionUser } from '../types'
import { RoundResponse } from './responseType'
import { BetResponseCAKE } from './cakeQueries'
import { BetResponseBNB } from './bnbQueries'

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
  roundResponse: RoundResponse<BetResponseCAKE | BetResponseBNB>,
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
    claimedNetBNB: 0,
    claimedBNB: 0,
  } as Bet
}

export const transformUserResponseToken = (userResponse): PredictionUser => {
  const { id, createdAt, updatedAt, block, totalBets, totalBetsBull, totalBetsBear, totalBetsClaimed, winRate } =
    userResponse || {}

  return {
    id,
    createdAt: numberOrNull(createdAt),
    updatedAt: numberOrNull(updatedAt),
    block: numberOrNull(block),
    totalBets: numberOrNull(totalBets),
    totalBetsBull: numberOrNull(totalBetsBull),
    totalBetsBear: numberOrNull(totalBetsBear),
    totalBetsClaimed: numberOrNull(totalBetsClaimed),
    winRate: winRate ? parseFloat(winRate) : 0,
    totalBNB: 0,
    totalBNBBull: 0,
    totalBNBBear: 0,
    totalBNBClaimed: 0,
    averageBNB: 0,
    netBNB: 0,
  }
}
