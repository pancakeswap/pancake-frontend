export interface UserResponse {
  id: string
  address: string
  block: string
  totalBets: string
  totalBNB: string
  bets?: BetResponse[]
}

export interface BetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  claimedHash: string
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
  position: string
  failed: boolean
  startAt: string
  startBlock: string
  startHash: string
  lockAt: string
  lockBlock: string
  lockHash: string
  lockPrice: string
  lockRoundId: string
  endAt: string
  endBlock: string
  endHash: string
  closePrice: string
  closeRoundId: string
  totalBets: string
  totalAmount: string
  totalAmountTreasury: string
  bullBets: string
  bullAmount: string
  bearBets: string
  bearAmount: string
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
  lockBlock
  lockHash
  lockPrice
  lockRoundId
  endAt
  endBlock
  endHash
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
  address
  block
  totalBets
  totalBNB
`
