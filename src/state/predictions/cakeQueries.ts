import { UserResponse, BetResponse, HistoricalBetResponse, RoundResponse } from './responseType'

export interface UserResponseCAKE extends UserResponse<BetResponseCAKE> {
  totalCAKE: string
  totalCAKEBull: string
  totalCAKEBear: string
  averageCAKE: string
  totalCAKEClaimed: string
  netCAKE: string
}

export interface BetResponseCAKE extends BetResponse {
  claimedCAKE: string
  claimedNetCAKE: string
  user?: UserResponseCAKE
  round?: RoundResponseCAKE
}

export type HistoricalBetResponseCAKE = HistoricalBetResponse<UserResponseCAKE>

export type RoundResponseCAKE = RoundResponse<BetResponseCAKE>

export interface TotalWonMarketResponseCAKE {
  totalCAKE: string
  totalCAKETreasury: string
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
 claimedCAKE
 claimedNetCAKE
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
  totalCAKE
  totalCAKEBull
  totalCAKEBear
  totalBetsClaimed
  totalCAKEClaimed
  winRate
  averageCAKE
  netCAKE
`
