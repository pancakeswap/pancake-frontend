import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseCAKE = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedToken: betResponse.claimedCAKE ? parseFloat(betResponse.claimedCAKE) : 0,
    claimedNetToken: betResponse.claimedNetCAKE ? parseFloat(betResponse.claimedNetCAKE) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseCAKE(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseCAKE)
  }

  return bet
}

export const transformUserResponseCAKE = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalCAKE, totalCAKEBull, totalCAKEBear, totalCAKEClaimed, averageCAKE, netCAKE } = userResponse || {}

  return {
    ...baseUserResponse,
    totalToken: totalCAKE ? parseFloat(totalCAKE) : 0,
    totalTokenBull: totalCAKEBull ? parseFloat(totalCAKEBull) : 0,
    totalTokenBear: totalCAKEBear ? parseFloat(totalCAKEBear) : 0,
    totalTokenClaimed: totalCAKEClaimed ? parseFloat(totalCAKEClaimed) : 0,
    averageToken: averageCAKE ? parseFloat(averageCAKE) : 0,
    netToken: netCAKE ? parseFloat(netCAKE) : 0,
  }
}
