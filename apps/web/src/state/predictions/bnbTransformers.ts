import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseBNB = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedToken: betResponse.claimedBNB ? parseFloat(betResponse.claimedBNB) : 0,
    claimedNetToken: betResponse.claimedNetBNB ? parseFloat(betResponse.claimedNetBNB) : 0,
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
    totalToken: totalBNB ? parseFloat(totalBNB) : 0,
    totalTokenBull: totalBNBBull ? parseFloat(totalBNBBull) : 0,
    totalTokenBear: totalBNBBear ? parseFloat(totalBNBBear) : 0,
    totalTokenClaimed: totalBNBClaimed ? parseFloat(totalBNBClaimed) : 0,
    averageToken: averageBNB ? parseFloat(averageBNB) : 0,
    netToken: netBNB ? parseFloat(netBNB) : 0,
  }
}
