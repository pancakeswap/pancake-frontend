import { BetResponse, RoundResponse, UserResponse } from './responseType'

export interface UserResponseBNB extends UserResponse<NewBetResponse> {
  totalAmount: string
  totalBullAmount: string
  totalBearAmount: string
  averageAmount: string
  totalClaimedAmount: string
  netAmount: string
}

export interface NewBetResponse extends BetResponse {
  claimedAmount: string
  claimedNetAmount: string
  user?: UserResponseBNB
  round?: RoundResponseBNB
}

export type RoundResponseBNB = RoundResponse<NewBetResponse>

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */
export const roundBaseFields = `
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

export const betBaseFields = `
  id
  hash
  amount
  position
  claimed
  claimedAt
  claimedAmount
  claimedBlock
  claimedHash
  claimedNetAmount
  createdAt
  updatedAt
`

export const userBaseFields = `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalAmount
  totalBullAmount
  totalBearAmount
  totalBetsClaimed
  totalClaimedAmount
  winRate
  averageAmount
  netAmount
`
