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
    totalToken: totalAmount ? parseFloat(totalAmount) : 0,
    totalTokenBull: totalBetsBull ? parseFloat(totalBetsBull) : 0,
    totalTokenBear: totalBetsBear ? parseFloat(totalBetsBear) : 0,
    totalTokenClaimed: totalClaimedAmount ? parseFloat(totalClaimedAmount) : 0,
    averageToken: averageAmount ? parseFloat(averageAmount) : 0,
    netToken: netAmount ? parseFloat(netAmount) : 0,
  }
}
