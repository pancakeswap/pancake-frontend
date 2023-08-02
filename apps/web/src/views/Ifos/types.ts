import BigNumber from 'bignumber.js'
import { IfoStatus, PoolIds } from '@pancakeswap/ifos'

import { useIfoV1Contract, useIfoV2Contract, useIfoV3Contract, useIfoV7Contract } from 'hooks/useContract'

// PoolCharacteristics retrieved from the contract
export interface PoolCharacteristics {
  raisingAmountPool: BigNumber
  offeringAmountPool: BigNumber
  limitPerUserInLP: BigNumber
  taxRate: number
  totalAmountPool: BigNumber
  sumTaxesOverflow: BigNumber

  // extends
  pointThreshold?: number
  distributionRatio?: number
  admissionProfile?: string
  needQualifiedNFT?: boolean
  needQualifiedPoints?: boolean
  vestingInformation?: VestingInformation
  hasTax?: boolean

  // 0: public sale
  // 1: private sale
  // 2: basic sale
  saleType?: number
}

// IFO data unrelated to the user returned by useGetPublicIfoData
export interface PublicIfoData {
  isInitialized: boolean
  status: IfoStatus
  blocksRemaining?: number
  secondsUntilStart: number
  progress: number
  secondsUntilEnd: number
  startBlockNum?: number
  endBlockNum?: number
  currencyPriceInUSD: BigNumber
  numberPoints: number
  thresholdPoints: bigint
  plannedStartTime?: number
  vestingStartTime?: number

  fetchIfoData: (currentBlock: number) => Promise<void>
  [PoolIds.poolBasic]?: PoolCharacteristics
  [PoolIds.poolUnlimited]: PoolCharacteristics

  startTimestamp?: number
  endTimestamp?: number
}

export interface VestingInformation {
  percentage: number
  cliff: number
  duration: number
  slicePeriodSeconds: number
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
  isVestingInitialized?: boolean
  vestingId?: string
  vestingComputeReleasableAmount?: BigNumber
}

// Use only inside the useGetWalletIfoData hook
export interface WalletIfoState {
  isInitialized: boolean
  [PoolIds.poolBasic]?: UserPoolCharacteristics
  [PoolIds.poolUnlimited]: UserPoolCharacteristics
  ifoCredit?: {
    credit: BigNumber
    /**
     * credit left is the ifo credit minus the amount of `amountTokenCommittedInLP` in unlimited pool
     * minimum is 0
     */
    creditLeft: BigNumber
  }
}

type WalletIfoBase = {
  allowance: BigNumber
  setPendingTx: (status: boolean, poolId: PoolIds) => void
  setIsClaimed: (poolId: PoolIds) => void
  fetchIfoData: () => Promise<void>
  resetIfoData: () => void
} & WalletIfoState

// Returned by useGetWalletIfoData
export type WalletIfoData = WalletIfoBase & WalletIfoContract

type WalletIfoDataV1Contract = {
  version: 1
  contract: ReturnType<typeof useIfoV1Contract>
}
type WalletIfoDataV2Contract = {
  version: 2
  contract: ReturnType<typeof useIfoV2Contract>
}
type WalletIfoDataV3Contract = {
  version: 3
  contract: ReturnType<typeof useIfoV3Contract>
}
type WalletIfoDataV7Contract = {
  version: 7
  contract: ReturnType<typeof useIfoV7Contract>
}
type WalletIfoContract =
  | WalletIfoDataV1Contract
  | WalletIfoDataV2Contract
  | WalletIfoDataV3Contract
  | WalletIfoDataV7Contract
