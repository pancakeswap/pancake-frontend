import ethers, { Contract, ContractFunction } from 'ethers'

export type MultiCallResponse<T> = T | null

export interface PredictionsRounds {
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
  rounds: ContractFunction<PredictionsRounds>
}
