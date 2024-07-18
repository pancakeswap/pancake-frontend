import { Protocol } from '@pancakeswap/farms'
import { Currency, Token } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & object

export type PoolInfo = Prettify<V2PoolInfo | V3PoolInfo | StablePoolInfo | V4BinPoolInfo>

export type BasePoolInfo = {
  pid?: number
  chainId: number
  lpAddress: Address
  protocol: Protocol
  token0: Currency
  token1: Token
  lpApr?: `${number}`
  tvlUsd?: `${number}`
  vol24hUsd?: `${number}`
  feeTier: number
  feeTierBase: number
  // @todo @ChefJerry add whitelist field
  whitelist?: boolean
}

export type V3PoolInfo = BasePoolInfo & {
  protocol: Protocol.V3
}

export type V2PoolInfo = BasePoolInfo & {
  protocol: Protocol.V2
}

export type StablePoolInfo = BasePoolInfo & {
  protocol: Protocol.STABLE
}

export type V4BinPoolInfo = BasePoolInfo & {
  protocol: Protocol.V4BIN
}

export type ChainIdAddressKey = `${number}:${Address}`
