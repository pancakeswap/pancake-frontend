import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseCAKE = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedBNB: betResponse.claimedCAKE ? parseFloat(betResponse.claimedCAKE) : 0,
    claimedNetBNB: betResponse.claimedNetCAKE ? parseFloat(betResponse.claimedNetCAKE) : 0,
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
    totalBNB: totalCAKE ? parseFloat(totalCAKE) : 0,
    totalBNBBull: totalCAKEBull ? parseFloat(totalCAKEBull) : 0,
    totalBNBBear: totalCAKEBear ? parseFloat(totalCAKEBear) : 0,
    totalBNBClaimed: totalCAKEClaimed ? parseFloat(totalCAKEClaimed) : 0,
    averageBNB: averageCAKE ? parseFloat(averageCAKE) : 0,
    netBNB: netCAKE ? parseFloat(netCAKE) : 0,
  }
}
