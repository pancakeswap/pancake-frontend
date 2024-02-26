import { ChainId } from '@pancakeswap/chains'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import type { Address, Hash } from 'viem'

export enum GaugeType {
  // @note: this is a hack
  // on SC StableSwap & V2 are same value,
  // just use -1 for StableSwap as id on FE
  StableSwap = -1,
  V2 = 0,
  V3 = 1,
  ALM = 2,
  VeCakePool = 3,
  Aptos = 4,
}

export const GAUGE_TYPE_NAMES: Record<GaugeType, string> = {
  [GaugeType.StableSwap]: 'StableSwap',
  [GaugeType.V2]: 'V2',
  [GaugeType.V3]: 'V3',
  [GaugeType.ALM]: 'ALM',
  [GaugeType.VeCakePool]: 'VeCakePool',
  [GaugeType.Aptos]: 'Aptos',
}

export interface GaugeBaseConfig {
  gid: number
  chainId: ChainId
  type: GaugeType
  address: Address
}

export interface GaugeV2Config extends GaugeBaseConfig {
  token0Address: Address
  token1Address: Address
  type: GaugeType.V2
  pairName: string
  feeTier: FeeAmount
}

export interface GaugeStableSwapConfig extends GaugeBaseConfig {
  type: GaugeType.StableSwap
  pairName: string
  tokenAddresses: Array<Address>
}
export interface GaugeV3Config extends GaugeBaseConfig {
  token0Address: Address
  token1Address: Address
  type: GaugeType.V3
  feeTier: FeeAmount
  pairName: string
}

export interface GaugeALMConfig extends GaugeBaseConfig {
  type: GaugeType.ALM
  token0Address: Address
  token1Address: Address
  pairName: string
}

export interface GaugeVeCakePoolConfig extends GaugeBaseConfig {
  type: GaugeType.VeCakePool
  pairName: string
}

export type GaugeConfig = GaugeV2Config | GaugeStableSwapConfig | GaugeV3Config | GaugeALMConfig | GaugeVeCakePoolConfig

export type GaugeInfo = {
  hash: Hash
  pairAddress: Address
  masterChef: Address
  pid: number
  chainId: number
  boostMultiplier: number
  maxVoteCap: number
  killed?: boolean
}

export type GaugeInfoConfig = GaugeInfo & GaugeConfig

export type Gauge = GaugeInfoConfig & {
  weight: bigint
  inCapWeight?: bigint
  notInCapWeight?: bigint
}
