export interface UserResponse {
  id: string
  createdAt: string
  updatedAt: string
  block: string
  totalBets: string
  totalBetsBull: string
  totalBetsBear: string
  totalBNB: string
  totalBNBBull: string
  totalBNBBear: string
  totalBetsClaimed: string
  totalBNBClaimed: string
  winRate: string
  averageBNB: string
  netBNB: string
  bets?: BetResponse[]
}

export interface BetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  claimedAt: string
  claimedHash: string
  claimedBNB: string
  claimedNetBNB: string
  createdAt: string
  updatedAt: string
  block: string
  user?: UserResponse
  round?: RoundResponse
}

export interface HistoricalBetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  user?: UserResponse
  round: {
    id: string
    epoch: string
  }
}

export interface RoundResponse {
  id: string
  epoch: string
  failed: boolean
  startBlock: string
  startAt: string
  startHash: string
  lockAt: string
  lockBlock: string
  lockPrice: string
  lockHash: string
  lockRoundId: string
  closeRoundId: string
  closeHash: string
  closeAt: string
  closePrice: string
  closeBlock: string
  totalBets: string
  totalAmount: string
  bearBets: string
  bullBets: string
  bearAmount: string
  bullAmount: string
  position: string
  totalAmountTreasury: string
  bets?: BetResponse[]
}

export interface TotalWonMarketResponse {
  totalBNB: string
  totalBNBTreasury: string
}

export interface TotalWonRoundResponse {
  totalAmount: string
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
  lockPrice
  lockRoundId
  closeAt
  closeBlock
  closeHash
  closePrice
  closeRoundId
  totalBets
  totalAmount
  totalAmountTreasury
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
  claimedHash
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
  winRate
  averageBNB
  netBNB
`
