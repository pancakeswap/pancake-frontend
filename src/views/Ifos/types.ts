import BigNumber from 'bignumber.js'
import ethers, { Contract } from 'ethers'
import { IfoStatus, PoolIds } from 'config/constants/types'

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInLP: BigNumber
  taxRate: number
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber
}

// IFO data unrelated to the user returned by useGetPublicIfoData
export interface PublicIfoData {
  isInitialized: boolean
  status: IfoStatus
  blocksRemaining: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startBlockNum: number
  endBlockNum: number
  currencyPriceInUSD: BigNumber
  numberPoints: number
  thresholdPoints: ethers.BigNumber
  fetchIfoData: (currentBlock: number) => void
  [PoolIds.poolBasic]?: PoolCharacteristics
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
  isInitialized: boolean
  [PoolIds.poolBasic]?: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
  ifoCredit?: {
    credit: BigNumber
    // credit left is the ifo credit minus the amount of `amountTokenCommittedInLP` in pool basic and unlimited
    creditLeft: BigNumber
  }
}

// Returned by useGetWalletIfoData
export interface WalletIfoData extends WalletIfoState {
  allowance: BigNumber
  contract: Contract
  setPendingTx: (status: boolean, poolId: PoolIds) => void
  setIsClaimed: (poolId: PoolIds) => void
  fetchIfoData: () => void
  resetIfoData: () => void
}
