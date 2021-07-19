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
  startTimestamp: ethers.BigNumber
  lockTimestamp: ethers.BigNumber
  closeTimestamp: ethers.BigNumber
  lockPrice: ethers.BigNumber
  closePrice: ethers.BigNumber
  totalAmount: ethers.BigNumber
  bullAmount: ethers.BigNumber
  bearAmount: ethers.BigNumber
  rewardBaseCalAmount: ethers.BigNumber
  rewardAmount: ethers.BigNumber
  priceResolved: boolean
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
