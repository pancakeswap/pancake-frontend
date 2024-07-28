import { ERC20Token, Pair } from '@pancakeswap/sdk'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'

export type PositionDetail = {
  // detail read from contract
  nonce: bigint
  tokenId: bigint
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint

  // additional detail
  isStaked?: boolean
  chainId: number
}

export type V2LPDetail = {
  balance: CurrencyAmount<ERC20Token>
  pair: Pair
  totalSupply: CurrencyAmount<ERC20Token>
  deposited0: CurrencyAmount<ERC20Token>
  deposited1: CurrencyAmount<ERC20Token>
}
