import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseBNB = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedBNB: betResponse.claimedBNB ? parseFloat(betResponse.claimedBNB) : 0,
    claimedNetBNB: betResponse.claimedNetBNB ? parseFloat(betResponse.claimedNetBNB) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseBNB(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseBNB)
  }

  return bet
}

export const transformUserResponseBNB = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalBNB, totalBNBBull, totalBNBBear, totalBNBClaimed, averageBNB, netBNB } = userResponse || {}

  return {
    ...baseUserResponse,
    totalBNB: totalBNB ? parseFloat(totalBNB) : 0,
    totalBNBBull: totalBNBBull ? parseFloat(totalBNBBull) : 0,
    totalBNBBear: totalBNBBear ? parseFloat(totalBNBBear) : 0,
    totalBNBClaimed: totalBNBClaimed ? parseFloat(totalBNBClaimed) : 0,
    averageBNB: averageBNB ? parseFloat(averageBNB) : 0,
    netBNB: netBNB ? parseFloat(netBNB) : 0,
  }
}
