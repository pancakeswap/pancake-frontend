import type { Address } from 'wagmi'
import { ChainId, Token } from '@pancakeswap/sdk'
import { PublicClient } from 'viem'

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
