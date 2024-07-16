import { Protocol } from '@pancakeswap/farms'
import { Currency, Token } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem'

export type PoolInfo = {
  chainId: number
  lpAddress: Address
  protocol: Protocol
  token0: Currency
  token1: Token
  lpApr?: `${number}`
  tvlUsd?: `${number}`
  vol24hUsd?: `${number}`
  feeTier: bigint
  feeTierBase: bigint
}
