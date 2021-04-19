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
  startBlock: string
  startAt: string
  lockAt: string
  lockBlock: string
  lockPrice: string
  endBlock: string
  closePrice: string
  totalBets: string
  totalAmount: string
  bearBets: string
  bullBets: string
  bearAmount: string
  bullAmount: string
  position: string
  bets: BetResponse[]
}

export const getRoundBaseFields = () => `
  id
  epoch
  startAt
  startBlock
  lockAt
  lockBlock
  lockPrice
  endAt
  endBlock
  closePrice
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
  position
`

export const getBetBaseFields = () => `
  id
  hash  
  amount
  position
  claimed
`

export const getUserBaseFields = () => `
  id
  address
  block
  totalBets
  totalBNB
`
