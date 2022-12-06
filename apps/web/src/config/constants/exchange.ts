import { ChainId, JSBI, Percent, Token } from '@pancakeswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import {bitgertTokens, dogechainTokens, dokenTokens, fuseTokens, xdcTokens} from '@pancakeswap/tokens'
import { ChainMap, ChainTokenList } from './types'

export const ROUTER_ADDRESS_COMMON = '0xBb5e1777A331ED93E07cF043363e48d320eb96c4'
export const ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.BITGERT]: ROUTER_ADDRESS_COMMON,
  [ChainId.DOGE]: ROUTER_ADDRESS_COMMON,
  [ChainId.DOKEN]: ROUTER_ADDRESS_COMMON,
  [ChainId.FUSE]: ROUTER_ADDRESS_COMMON,
  [ChainId.XDC]: ROUTER_ADDRESS_COMMON,
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.BITGERT]: [
    bitgertTokens.wbrise,
    bitgertTokens.ice,
    bitgertTokens.usdci,
    bitgertTokens.usdti,
  ],
  [ChainId.DOGE]: [
    dogechainTokens.wdoge,
    dogechainTokens.ice,
    dogechainTokens.usdt
  ],
  [ChainId.DOKEN]: [
    dokenTokens.wdkn,
    dokenTokens.ice,
    dokenTokens.usdt
  ],
  [ChainId.FUSE]: [
    fuseTokens.wfuse,
    fuseTokens.ice
  ],
  [ChainId.XDC]: [
    xdcTokens.wxdc,
    xdcTokens.ice,
    xdcTokens.usdt
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.BITGERT]: [bitgertTokens.ice, bitgertTokens.usdti],
  [ChainId.DOGE]: [dogechainTokens.ice],
  [ChainId.DOKEN]: [dokenTokens.ice],
  [ChainId.FUSE]: [fuseTokens.ice],
  [ChainId.XDC]: [xdcTokens.ice]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.BITGERT]: [bitgertTokens.wbrise, bitgertTokens.sphynx, bitgertTokens.bpad, bitgertTokens.broge, bitgertTokens.brzilla, bitgertTokens.btxt, bitgertTokens.eltg, bitgertTokens.evo, bitgertTokens.map, bitgertTokens.miidas, bitgertTokens.mir, bitgertTokens.numi, bitgertTokens.omnia, bitgertTokens.prds, bitgertTokens.rluna, bitgertTokens.vef, bitgertTokens.wmf, bitgertTokens.yogo, bitgertTokens.ypc, bitgertTokens.ice, bitgertTokens.tokyo, bitgertTokens.usdc, bitgertTokens.usdt, bitgertTokens.wolf, bitgertTokens.usdti, bitgertTokens.$3dc, bitgertTokens.darrival, bitgertTokens.ethi, bitgertTokens.dogei, bitgertTokens.bnbi, bitgertTokens.shibi, bitgertTokens.daii, bitgertTokens.usdc, bitgertTokens.busdi, bitgertTokens.baskom, bitgertTokens.abr, bitgertTokens.lung],
  [ChainId.DOGE]: [dogechainTokens.wdoge, dogechainTokens.ice],
  [ChainId.DOKEN]: [dokenTokens.wdkn, dokenTokens.ice, dokenTokens.usdt],
  [ChainId.FUSE]: [fuseTokens.wfuse, fuseTokens.ice, fuseTokens.doge, fuseTokens.shiba],
  [ChainId.XDC]: [xdcTokens.wxdc, xdcTokens.ice, xdcTokens.usdt, xdcTokens.usdc],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BITGERT]: [
    [bitgertTokens.wbrise, bitgertTokens.ice],
    [bitgertTokens.usdti, bitgertTokens.ice],
  ],
  [ChainId.DOGE]: [
    [dogechainTokens.wdoge, dogechainTokens.ice],
    [dogechainTokens.usdt, dogechainTokens.ice],
  ],
  [ChainId.DOKEN]: [
    [dokenTokens.wdkn, dokenTokens.ice],
  ],
  [ChainId.FUSE]: [
    [fuseTokens.wfuse, fuseTokens.ice],
  ],
  [ChainId.XDC]: [
    [xdcTokens.wxdc, xdcTokens.ice],
    [xdcTokens.usdt, xdcTokens.ice],
  ],
}

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_TEN = JSBI.BigInt(10)

// one basis point
export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(JSBI.BigInt(25), BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'BNB'
// ICE
export const DEFAULT_OUTPUT_CURRENCY = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'

// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000)

export const LIMIT_ORDERS_DOCS_URL = 'https://docs.pancakeswap.finance/products/pancakeswap-exchange/limit-orders'

export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove']
