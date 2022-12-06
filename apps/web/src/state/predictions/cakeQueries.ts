import { UserResponse, BetResponse, HistoricalBetResponse, RoundResponse } from './responseType'

export interface UserResponseICE extends UserResponse<BetResponseICE> {
  totalICE: string
  totalICEBull: string
  totalICEBear: string
  averageICE: string
  totalICEClaimed: string
  netICE: string
}

export interface BetResponseICE extends BetResponse {
  claimedICE: string
  claimedNetICE: string
  user?: UserResponseICE
  round?: RoundResponseICE
}

export type HistoricalBetResponseICE = HistoricalBetResponse<UserResponseICE>

export type RoundResponseICE = RoundResponse<BetResponseICE>

export interface TotalWonMarketResponseICE {
  totalICE: string
  totalICETreasury: string
}

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
 claimedHash
 claimedBlock
 claimedICE
 claimedNetICE
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
  totalICE
  totalICEBull
  totalICEBear
  totalBetsClaimed
  totalICEClaimed
  winRate
  averageICE
  netICE
`
