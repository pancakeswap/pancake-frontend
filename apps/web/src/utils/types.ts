export type MultiCallResponse<T> = T | null

// Predictions
export type PredictionsClaimableResponse = boolean

export interface PredictionsLedgerResponse {
  position: 0 | 1
  amount: bigint
  claimed: boolean
}

export interface PredictionsRoundsResponse {
  epoch: bigint
  startTimestamp: bigint
  lockTimestamp: bigint
  closeTimestamp: bigint
  lockPrice: bigint
  closePrice: bigint
  lockOracleId: bigint
  closeOracleId: bigint
  totalAmount: bigint
  bullAmount: bigint
  bearAmount: bigint
  rewardBaseCalAmount: bigint
  rewardAmount: bigint
  oracleCalled: boolean
}

// [rounds, ledgers, count]
export type PredictionsGetUserRoundsResponse = [bigint[], PredictionsLedgerResponse[], bigint]

// Farm Auction

// Note: slightly different from AuctionStatus used throughout UI
export enum FarmAuctionContractStatus {
  Pending,
  Open,
  Close,
}

export interface AuctionsResponse {
  status: FarmAuctionContractStatus
  startBlock: bigint
  endBlock: bigint
  initialBidAmount: bigint
  leaderboard: bigint
  leaderboardThreshold: bigint
}

export interface BidsPerAuction {
  account: string
  amount: bigint
}
