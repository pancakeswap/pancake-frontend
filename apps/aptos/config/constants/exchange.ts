import { ChainId, ONE_HUNDRED_PERCENT, Percent, Token, Coin } from '@pancakeswap/aptos-swap-sdk'
import { APT, CE_USDC, L0_USDC, WH_USDC, CAKE, CE_BNB_MAINNET } from 'config/coins'
import { ChainTokenList } from './types'

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n
export const BIG_INT_20 = 20n

// used to ensure the user doesn't send so much APT so they end up with <0.00000002
export const MIN_APT: bigint = BIG_INT_TEN ** 6n * 2n // .02 APT

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [L0_USDC[ChainId.MAINNET], CAKE[ChainId.MAINNET], CE_BNB_MAINNET],
  [ChainId.TESTNET]: [L0_USDC[ChainId.TESTNET], CAKE[ChainId.TESTNET], CE_BNB_MAINNET],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainId.TESTNET]: [
    APT[ChainId.TESTNET],
    new Coin(
      ChainId.TESTNET,
      '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB',
      8,
      'BNB',
    ),
    new Coin(
      ChainId.TESTNET,
      '0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH',
      8,
      'ETH',
    ),
  ],
  [ChainId.MAINNET]: [
    APT[ChainId.MAINNET],
    L0_USDC[ChainId.MAINNET],
    CE_USDC[ChainId.MAINNET],
    WH_USDC[ChainId.MAINNET],
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [],
  [ChainId.TESTNET]: [],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [],
  [ChainId.TESTNET]: [],
}

export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// TODO: merge sdk
export const BASE_FEE = new Percent(25n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)
