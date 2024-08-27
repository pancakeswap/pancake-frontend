import { Protocol } from '@pancakeswap/farms'
import { ERC20Token, Pair } from '@pancakeswap/sdk'
import { LegacyStableSwapPair } from '@pancakeswap/smart-router/legacy-router'
import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem/accounts'

export type PositionDetail = {
  // detail read from contract
  nonce: bigint
  tokenId: bigint
  operator: string
  token0: Address
  token1: Address
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
  protocol: Protocol

  farmingMultiplier: number
  farmingLiquidity: bigint
}

export type V2LPDetail = {
  nativeBalance: CurrencyAmount<ERC20Token>
  farmingBalance: CurrencyAmount<ERC20Token>
  pair: Pair
  totalSupply: CurrencyAmount<ERC20Token>
  nativeDeposited0: CurrencyAmount<ERC20Token>
  nativeDeposited1: CurrencyAmount<ERC20Token>
  farmingDeposited0: CurrencyAmount<ERC20Token>
  farmingDeposited1: CurrencyAmount<ERC20Token>
  farmingBoosterMultiplier: number
  farmingBoostedAmount: CurrencyAmount<ERC20Token>
  isStaked?: boolean
  protocol: Protocol
}

export type StableLPDetail = {
  nativeBalance: CurrencyAmount<ERC20Token>
  farmingBalance: CurrencyAmount<ERC20Token>
  totalSupply: CurrencyAmount<ERC20Token>
  pair: LegacyStableSwapPair
  // fee: pair.stableTotalFee * 1000000
  // lpFee: pair.stableLpFee * 1000000
  nativeDeposited0: CurrencyAmount<ERC20Token>
  farmingDeposited0: CurrencyAmount<ERC20Token>
  nativeDeposited1: CurrencyAmount<ERC20Token>
  farmingDeposited1: CurrencyAmount<ERC20Token>
  farmingBoosterMultiplier: number
  farmingBoostedAmount: CurrencyAmount<ERC20Token>
  isStaked?: boolean
  protocol: Protocol
}

export type PairListType = PositionDetail | V2LPDetail | StableLPDetail
