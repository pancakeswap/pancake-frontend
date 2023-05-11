import { ChainId, Percent, Token, WNATIVE } from '@pancakeswap/sdk'
import { bscTokens, bscTestnetTokens, USDC, USDT, BUSD, WBTC_ETH } from '@pancakeswap/tokens'
import { ChainMap, ChainTokenList } from './types'

export const CHAIN_REFRESH_TIME = {
  [ChainId.ETHEREUM]: 12_000,
  [ChainId.GOERLI]: 12_000,
  [ChainId.BSC]: 6_000,
  [ChainId.BSC_TESTNET]: 6_000,
} as const satisfies Record<ChainId, number>

export const ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.GOERLI]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.BSC]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [ChainId.BSC_TESTNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [WNATIVE[ChainId.GOERLI], USDC[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {
    // SNFTS-SFUND
    [bscTokens.snfts.address]: [bscTokens.sfund],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {
    [bscTokens.axlusdc.address]: [bscTokens.usdt],
  },
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.usdt, bscTokens.cake, bscTokens.btcb],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt, bscTokens.cake],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBTC_ETH, WNATIVE[ChainId.ETHEREUM]],
    [WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  ],
  [ChainId.BSC]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
}

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n

// one basis point
export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** 16n // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(25n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'BNB'
// CAKE
export const DEFAULT_OUTPUT_CURRENCY = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = 500000n

export const LIMIT_ORDERS_DOCS_URL = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/limit-orders'

export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove']
