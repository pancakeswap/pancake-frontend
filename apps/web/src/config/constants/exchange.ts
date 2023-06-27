import { ChainId, Percent, Token, WNATIVE } from '@pancakeswap/sdk'
import {
  bscTokens,
  bscTestnetTokens,
  USDC,
  USDT,
  BUSD,
  WBTC_ETH,
  arbitrumTokens,
  polygonZkEvmTokens,
  polygonZkEvmTestnetTokens,
  zksyncTokens,
  zkSyncTestnetTokens,
  lineaTestnetTokens,
  arbitrumGoerliTokens,
} from '@pancakeswap/tokens'
import { ChainTokenList } from './types'

export {
  ADDITIONAL_BASES,
  V2_ROUTER_ADDRESS,
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
} from '@pancakeswap/smart-router/evm'

export const CHAIN_REFRESH_TIME = {
  [ChainId.ETHEREUM]: 12_000,
  [ChainId.GOERLI]: 12_000,
  [ChainId.BSC]: 6_000,
  [ChainId.BSC_TESTNET]: 6_000,
  [ChainId.ARBITRUM_ONE]: 4_000,
  [ChainId.ARBITRUM_GOERLI]: 4_000,
  [ChainId.POLYGON_ZKEVM]: 7_000,
  [ChainId.POLYGON_ZKEVM_TESTNET]: 7_000,
  [ChainId.ZKSYNC]: 3_000,
  [ChainId.ZKSYNC_TESTNET]: 3_000,
  [ChainId.LINEA_TESTNET]: 12_000,
} as const satisfies Record<ChainId, number>

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.usdt, bscTokens.cake, bscTokens.btcb],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.weth, arbitrumTokens.usdt, arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt, polygonZkEvmTokens.usdc],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc, zksyncTokens.weth],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc, lineaTestnetTokens.weth],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [USDC[ChainId.GOERLI], WNATIVE[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt, bscTokens.cake],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.weth, arbitrumTokens.usdt, arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt, polygonZkEvmTokens.usdc],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc, zksyncTokens.weth],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc, lineaTestnetTokens.weth],
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
  [ChainId.ARBITRUM_ONE]: [
    [arbitrumTokens.weth, arbitrumTokens.usdt],
    [arbitrumTokens.weth, arbitrumTokens.usdc],
  ],
  [ChainId.ARBITRUM_GOERLI]: [[arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc]],
  [ChainId.POLYGON_ZKEVM]: [[polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt]],
  [ChainId.ZKSYNC]: [[zksyncTokens.usdc, zksyncTokens.weth]],
  [ChainId.ZKSYNC_TESTNET]: [[zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth]],
  [ChainId.LINEA_TESTNET]: [[lineaTestnetTokens.usdc, lineaTestnetTokens.weth]],
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
export const MIN_BNB: bigint = BIG_INT_TEN ** 15n // .001 BNB
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
