import { FarmAuction, Predictions } from 'config/abi/types'
import ethers, { ContractFunction } from 'ethers'

export type MultiCallResponse<T> = T | null

// Predictions
export type PredictionsClaimableResponse = boolean

export interface PredictionsLedgerResponse {
  position: 0 | 1
  amount: ethers.BigNumber
  claimed: boolean
}

export interface PredictionsRoundsResponse {
  epoch: ethers.BigNumber
  startTimestamp: ethers.BigNumber
  lockTimestamp: ethers.BigNumber
  closeTimestamp: ethers.BigNumber
  lockPrice: ethers.BigNumber
  closePrice: ethers.BigNumber
  lockOracleId: ethers.BigNumber
  closeOracleId: ethers.BigNumber
  totalAmount: ethers.BigNumber
  bullAmount: ethers.BigNumber
  bearAmount: ethers.BigNumber
  rewardBaseCalAmount: ethers.BigNumber
  rewardAmount: ethers.BigNumber
  oracleCalled: boolean
}

// [rounds, ledgers, count]
export type PredictionsGetUserRoundsResponse = [ethers.BigNumber[], PredictionsLedgerResponse[], ethers.BigNumber]

export type PredictionsGetUserRoundsLengthResponse = ethers.BigNumber

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
  startBlock: ethers.BigNumber
  endBlock: ethers.BigNumber
  initialBidAmount: ethers.BigNumber
  leaderboard: ethers.BigNumber
  leaderboardThreshold: ethers.BigNumber
}

export interface BidsPerAuction {
  account: string
  amount: ethers.BigNumber
}

type GetWhitelistedAddressesResponse = [
  {
    account: string
    lpToken: string
    token: string
  }[],
  ethers.BigNumber,
]

export interface FarmAuctionContract extends Omit<FarmAuction, 'auctions'> {
  auctions: ContractFunction<AuctionsResponse>
  getWhitelistedAddresses: ContractFunction<GetWhitelistedAddressesResponse>
}
