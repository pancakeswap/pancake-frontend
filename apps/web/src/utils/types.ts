import { FarmAuction, Predictions } from 'config/abi/types'
import { Contract, ContractFunction } from '@ethersproject/contracts'
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

export interface PredictionsContract extends Omit<Predictions, 'getUserRounds' | 'ledger'> {
  getUserRounds: ContractFunction<PredictionsGetUserRoundsResponse>
  ledger: ContractFunction<PredictionsLedgerResponse>
}

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

type GetWhitelistedAddressesResponse = [
  {
    account: string
    lpToken: string
    token: string
  }[],
  BigNumber,
]

export interface FarmAuctionContract extends Omit<FarmAuction, 'auctions'> {
  auctions: ContractFunction<AuctionsResponse>
  getWhitelistedAddresses: ContractFunction<GetWhitelistedAddressesResponse>
}

// generic contract types

export type MaybeContract<C extends Contract = Contract> = C | null | undefined
export type ContractMethodName<C extends Contract = Contract> = keyof C['callStatic'] & string

export type ContractMethodParams<
  C extends Contract = Contract,
  N extends ContractMethodName<C> = ContractMethodName<C>,
> = Parameters<C['callStatic'][N]>
