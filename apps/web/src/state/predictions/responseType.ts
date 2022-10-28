export interface UserResponse<BetType> {
  id: string
  createdAt: string
  updatedAt: string
  block: string
  totalBets: string
  totalBetsBull: string
  totalBetsBear: string
  totalBetsClaimed: string
  winRate: string
  averageBNB: string
  bets?: BetType[]
}

export interface BetResponse {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  claimedAt: string
  claimedBlock: string
  claimedHash: string
  createdAt: string
  updatedAt: string
  block: string
}

export interface HistoricalBetResponse<UserType> {
  id: string
  hash: string
  amount: string
  position: string
  claimed: boolean
  user?: UserType
  round: {
    id: string
    epoch: string
  }
}

export interface RoundResponse<BetType> {
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
  closeAt: string
  closeBlock: string
  closeHash: string
  closePrice: string
  closeRoundId: string
  totalBets: string
  totalAmount: string
  bullBets: string
  bullAmount: string
  bearBets: string
  bearAmount: string
  bets?: BetType[]
}
