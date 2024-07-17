import { Protocol } from '@pancakeswap/farms'
import { Currency, Token } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem'

export type PoolInfo = {
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

export type V3PoolInfo = PoolInfo & {
  protocol: 'v3'
}

export type V2PoolInfo = PoolInfo & {
  protocol: 'v2'
}

export type StablePoolInfo = PoolInfo & {
  protocol: 'stable'
}

export type ChainIdAddressKey = `${number}:${Address}`
