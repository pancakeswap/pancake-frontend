import { Bet, PredictionUser } from 'state/types'
import { transformBetResponseToken, transformRoundResponseToken, transformUserResponseToken } from './tokenTransformers'

export const newTransformBetResponse = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedAmount: betResponse.claimedAmount ? parseFloat(betResponse.claimedAmount) : 0,
    claimedNetAmount: betResponse.claimedNetAmount ? parseFloat(betResponse.claimedNetAmount) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = newTransformUserResponse(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, newTransformBetResponse)
  }

  return bet
}

export const newTransformUserResponse = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalAmount, totalBetsBull, totalBetsBear, totalClaimedAmount, averageAmount, netAmount } = userResponse || {}

  return {
    ...baseUserResponse,
    totalBNB: totalAmount ? parseFloat(totalAmount) : 0,
    totalBNBBull: totalBetsBull ? parseFloat(totalBetsBull) : 0,
    totalBNBBear: totalBetsBear ? parseFloat(totalBetsBear) : 0,
    totalBNBClaimed: totalClaimedAmount ? parseFloat(totalClaimedAmount) : 0,
    averageBNB: averageAmount ? parseFloat(averageAmount) : 0,
    netBNB: netAmount ? parseFloat(netAmount) : 0,
  }
}
