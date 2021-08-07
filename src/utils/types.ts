import ethers, { Contract, ContractFunction } from 'ethers'

export type MultiCallResponse<T> = T | null

// Predictions
export type PredictionsClaimableResponse = boolean

export interface PredictionsLedgerResponse {
  position: 0 | 1
  amount: ethers.BigNumber
  claimed: boolean
}

export type PredictionsRefundableResponse = boolean

export interface PredictionsRoundsResponse {
  epoch: ethers.BigNumber
  startBlock: ethers.BigNumber
  lockBlock: ethers.BigNumber
  endBlock: ethers.BigNumber
  lockPrice: ethers.BigNumber
  closePrice: ethers.BigNumber
  totalAmount: ethers.BigNumber
  bullAmount: ethers.BigNumber
  bearAmount: ethers.BigNumber
  rewardBaseCalAmount: ethers.BigNumber
  rewardAmount: ethers.BigNumber
  oracleCalled: boolean
}

export interface PredictionsContract extends Contract {
  claimable: ContractFunction<PredictionsClaimableResponse>
  ledger: ContractFunction<PredictionsLedgerResponse>
  refundable: ContractFunction<PredictionsRefundableResponse>
  rounds: ContractFunction<PredictionsRoundsResponse>
}

// Chainlink Orance
export type ChainLinkOracleLatestAnswerResponse = ethers.BigNumber

export interface ChainLinkOracleContract extends Contract {
  latestAnswer: ContractFunction<ChainLinkOracleLatestAnswerResponse>
}

// Farm Auction

// Note: slightly different from AuctionStatus used thoughout UI
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

export type ViewBidsPerAuctionResponse = [BidsPerAuction[], ethers.BigNumber]

// [auctionId, bids, claimed, nextCursor]
export type ViewBidderAuctionsResponse = [ethers.BigNumber[], ethers.BigNumber[], boolean[], ethers.BigNumber]

type GetWhitelistedAddressesResponse = [
  {
    account: string
    lpToken: string
    token: string
  }[],
  ethers.BigNumber,
]

interface AuctionsHistoryResponse {
  totalAmount: ethers.BigNumber
  hasClaimed: boolean
}

export interface FarmAuctionContract extends Contract {
  currentAuctionId: ContractFunction<ethers.BigNumber>
  viewBidders: ContractFunction<[string[], ethers.BigNumber]>
  totalCollected: ContractFunction<ethers.BigNumber>
  auctions: ContractFunction<AuctionsResponse>
  claimable: ContractFunction<boolean>
  viewBidsPerAuction: ContractFunction<ViewBidsPerAuctionResponse>
  viewBidderAuctions: ContractFunction<ViewBidderAuctionsResponse>
  whitelisted: ContractFunction<boolean>
  getWhitelistedAddresses: ContractFunction<GetWhitelistedAddressesResponse>
  auctionsHistory: ContractFunction<AuctionsHistoryResponse>
}
