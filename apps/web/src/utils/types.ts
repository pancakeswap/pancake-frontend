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
  totalAmount: bigint
  bullAmount: bigint
  bearAmount: bigint
  rewardBaseCalAmount: bigint
  rewardAmount: bigint
  oracleCalled: boolean

  // PredictionsV2
  lockOracleId?: bigint
  closeOracleId?: bigint

  // AI Predictions
  AIPrice?: bigint
}

// [rounds, ledgers, count]
export type PredictionsGetUserRoundsResponse = [bigint[], PredictionsLedgerResponse[], bigint]
