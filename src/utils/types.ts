import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'

export type MultiCallResponse<T> = T | null

// Predictions
export type PredictionsClaimableResponse = boolean

export interface PredictionsLedgerResponse {
  position: 0 | 1
  amount: BigNumber
  claimed: boolean
}

export interface PredictionsRoundsResponse {
  epoch: BigNumber
  startTimestamp: BigNumber
  lockTimestamp: BigNumber
  closeTimestamp: BigNumber
  lockPrice: BigNumber
  closePrice: BigNumber
  lockOracleId: BigNumber
  closeOracleId: BigNumber
  totalAmount: BigNumber
  bullAmount: BigNumber
  bearAmount: BigNumber
  rewardBaseCalAmount: BigNumber
  rewardAmount: BigNumber
  oracleCalled: boolean
}

// [rounds, ledgers, count]
export type PredictionsGetUserRoundsResponse = [BigNumber[], PredictionsLedgerResponse[], BigNumber]

export type PredictionsGetUserRoundsLengthResponse = BigNumber

// Farm Auction

// Note: slightly different from AuctionStatus used throughout UI
export enum FarmAuctionContractStatus {
  Pending,
  Open,
  Close,
}

export interface AuctionsResponse {
  status: FarmAuctionContractStatus
  startBlock: BigNumber
  endBlock: BigNumber
  initialBidAmount: BigNumber
  leaderboard: BigNumber
  leaderboardThreshold: BigNumber
}

export interface BidsPerAuction {
  account: string
  amount: BigNumber
}

// generic contract types

export type MaybeContract<C extends Contract = Contract> = C | null | undefined
export type ContractMethodName<C extends Contract = Contract> = keyof C['callStatic'] & string

export type ContractMethodParams<
  C extends Contract = Contract,
  N extends ContractMethodName<C> = ContractMethodName<C>,
> = Parameters<C['callStatic'][N]>
