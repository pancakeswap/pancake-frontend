import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { IfoStatus } from 'config/constants/types'

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInLP: BigNumber
  hasTax: boolean
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber
}

// IFO data unrelated to the user returned by useGetPublicIfoData
export interface PublicIfoData {
  status: IfoStatus
  blocksRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startBlockNum: number
  endBlockNum: number
  [PoolIds.poolBasic]: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics
}

// User specific pool characteristics
export interface UserPoolCharacteristics {
  amountTokenCommittedInLP: BigNumber // @contract: amountPool
  offeringAmountInToken: BigNumber // @contract: userOfferingAmountPool
  refundingAmountInLP: BigNumber // @contract: userRefundingAmountPool
  taxAmountInLP: BigNumber // @contract: userTaxAmountPool
  hasClaimed: boolean // @contract: claimedPool
  isPendingTx: boolean
}

// Use only inside the useGetWalletIfoData hook
export interface WalletIfoState {
  [PoolIds.poolBasic]: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
}

// Returned by useGetWalletIfoData
export interface WalletIfoData extends WalletIfoState {
  allowance: BigNumber
  contract: Contract
  setPendingTx: (status: boolean, poolId: PoolIds) => void
  addUserContributedAmount: (amount: BigNumber, poolId: PoolIds) => void
  setIsClaimed: (poolId: PoolIds) => void
}
