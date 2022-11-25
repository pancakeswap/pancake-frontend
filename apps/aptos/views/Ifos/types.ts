import BigNumber from 'bignumber.js'

import { PoolIds } from 'config/constants/types'

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInLP: BigNumber
  taxRate: number
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber

  // extends
  // pointThreshold?: number
  vestingInformation?: VestingInformation
}

// IFO data unrelated to the user returned by useGetPublicIfoData
export interface PublicIfoData {
  isInitialized: boolean
  startTime: number
  endTime: number
  currencyPriceInUSD: BigNumber
  vestingStartTime?: number

  // [PoolIds.poolBasic]?: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics
}

export interface VestingInformation {
  percentage: number
  cliff: number
  duration: number
  slicePeriodSeconds: number
}

export interface VestingCharacteristics {
  vestingId: string
  vestingReleased: BigNumber
  vestingAmountTotal: BigNumber
  vestingComputeReleasableAmount: BigNumber
  vestingInformationPercentage: number
  vestingInformationDuration: number
}

// User specific pool characteristics
export interface UserPoolCharacteristics {
  amountTokenCommittedInLP: BigNumber // @contract: amountPool
  offeringAmountInToken: BigNumber // @contract: userOfferingAmountPool
  refundingAmountInLP: BigNumber // @contract: userRefundingAmountPool
  taxAmountInLP: BigNumber // @contract: userTaxAmountPool
  hasClaimed: boolean // @contract: claimedPool
  isPendingTx: boolean
  vestingReleased?: BigNumber
  vestingAmountTotal?: BigNumber
  // Not in contract, compute this by checking if there is a vesting schedule for this user.
  isVestingInitialized?: boolean
  vestingId?: string
  vestingComputeReleasableAmount?: BigNumber
}

// Use only inside the useGetWalletIfoData hook
export interface WalletIfoState {
  isInitialized: boolean
  // [PoolIds.poolBasic]?: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
}

// Returned by useGetWalletIfoData
export interface WalletIfoData extends WalletIfoState {
  setPendingTx: (status: boolean, poolId: PoolIds) => void
  setIsClaimed: (poolId: PoolIds) => void
}
