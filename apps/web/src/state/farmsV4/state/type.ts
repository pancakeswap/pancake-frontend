import { Protocol } from '@pancakeswap/farms'
import { Currency, Token } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & object

export type PoolInfo = Prettify<V2PoolInfo | StablePoolInfo | V3PoolInfo | V4BinPoolInfo>

export type BasePoolInfo = {
  pid?: number
  chainId: number
  lpAddress: Address
  stableSwapAddress?: Address
  protocol: Protocol
  token0: Currency
  token1: Token
  token0Price?: `${number}`
  token1Price?: `${number}`
  tvlToken0?: `${number}`
  tvlToken1?: `${number}`
  lpApr?: `${number}`
  tvlUsd?: `${number}`
  tvlUsd24h?: `${number}`
  vol24hUsd?: `${number}`
  vol48hUsd?: `${number}`
  vol7dUsd?: `${number}`
  fee24hUsd?: `${number}`
  liquidity?: bigint
  feeTier: number
  feeTierBase: number
  totalFeeUSD?: `${number}`
  isFarming: boolean
}

export type V3PoolInfo = BasePoolInfo & {
  protocol: Protocol.V3
}

export type V2PoolInfo = BasePoolInfo & {
  protocol: Protocol.V2
  // V2 farming pools should have a bCakeWrapperAddress
  bCakeWrapperAddress?: Address
}

export type StablePoolInfo = BasePoolInfo & {
  protocol: Protocol.STABLE
  // Stable farming pools should have a bCakeWrapperAddress
  bCakeWrapperAddress?: Address
}

export type V4BinPoolInfo = BasePoolInfo & {
  protocol: Protocol.V4BIN
}

export type ChainIdAddressKey = `${number}:${Address}`
