import type { Address } from 'wagmi'
import { ChainId, Token } from '@pancakeswap/sdk'
import { PublicClient } from 'viem'
import { MessageStatus } from '@layerzerolabs/scan-client'
import BigNumber from 'bignumber.js'

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

type IfoPoolInfo = {
  saleAmount?: string
  raiseAmount: string
  cakeToBurn?: string
  distributionRatio?: number // Range [0-1]
}

export type BaseIfoConfig = {
  id: string
  isActive: boolean
  address: Address
  name: string
  currency: Token
  token: Token
  articleUrl: string
  campaignId: string
  tokenOfferingPrice: number | null
  description?: string
  twitterUrl?: string
  telegramUrl?: string
  version: number
  vestingTitle?: string
  cIFO?: boolean
  plannedStartTime?: number
  [PoolIds.poolBasic]?: IfoPoolInfo
  [PoolIds.poolUnlimited]: IfoPoolInfo
}

export type Ifo = {
  chainId: ChainId
} & BaseIfoConfig

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => PublicClient

export type CrossChainMessage = {
  srcUaAddress: Address
  srcChainId: ChainId
  srcUaNonce: number
  dstChainId: ChainId
  dstUaAddress: Address
  dstTxHash?: string
  status: MessageStatus
}

export type VestingCharacteristics = {
  vestingId: string
  offeringAmountInToken: BigNumber
  vestingReleased: BigNumber
  vestingAmountTotal: BigNumber
  vestingComputeReleasableAmount: BigNumber
  vestingInformationPercentage: number
  vestingInformationDuration: number
  isVestingInitialized: boolean
}

export type UserVestingData = {
  vestingStartTime: number
  [PoolIds.poolBasic]: VestingCharacteristics
  [PoolIds.poolUnlimited]: VestingCharacteristics
}

export { MessageStatus }
