import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { IfoStatus } from 'config/constants/types'

export interface PublicIfoData {
  status: IfoStatus
  blocksRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  raisingAmount: BigNumber
  totalAmount: BigNumber
  startBlockNum: number
  endBlockNum: number
}

export interface UserInfo {
  amount: BigNumber
  claimed: boolean
}

export interface WalletIfoState {
  isPendingTx: boolean
  offeringTokenBalance: BigNumber
  refundingAmount: BigNumber
  userInfo: UserInfo
}

export interface WalletIfoData extends WalletIfoState {
  allowance: BigNumber
  contract: Contract
  setPendingTx: (status: boolean) => void
  addUserContributedAmount: (amount: BigNumber) => void
  setIsClaimed: () => void
}
