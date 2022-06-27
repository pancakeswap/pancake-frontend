import { UserResponse, BetResponse, HistoricalBetResponse, RoundResponse } from './responseType'

export interface UserResponseBNB extends UserResponse<BetResponseBNB> {
  totalBNB: string
  totalBNBBull: string
  totalBNBBear: string
  averageBNB: string
  totalBNBClaimed: string
  netBNB: string
}

export interface BetResponseBNB extends BetResponse {
  claimedBNB: string
  claimedNetBNB: string
  user?: UserResponseBNB
  round?: RoundResponseBNB
}

export type HistoricalBetResponseBNB = HistoricalBetResponse<UserResponseBNB>

export type RoundResponseBNB = RoundResponse<BetResponseBNB>

export interface TotalWonMarketResponseBNB {
  totalBNB: string
  totalBNBTreasury: string
}

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */
export const getRoundBaseFields = () => `
  id
  epoch
  position
  failed
  startAt
  startBlock
  startHash
  lockAt
  lockBlock
  lockHash
  lockPrice
  lockRoundId
  closeAt
  closeBlock
  closeHash
  closePrice
  closeRoundId
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
`

export const getBetBaseFields = () => `
 id
 hash  
 amount
 position
 claimed
 claimedAt
 claimedHash
 claimedBlock
 claimedBNB
 claimedNetBNB
 createdAt
 updatedAt
`

export const getUserBaseFields = () => `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalBNB
  totalBNBBull
  totalBNBBear
  totalBetsClaimed
  totalBNBClaimed
  winRate
  averageBNB
  netBNB
`
