import { ChainId } from '@pancakeswap/aptos-swap-sdk'
import { JSBI, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { APT } from 'config/coins'

export const SUGGESTED_BASES = {}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainId.DEVNET]: [APT[ChainId.DEVNET]],
  [ChainId.AIT3]: [APT[ChainId.AIT3]],
  [ChainId.TESTNET]: [APT[ChainId.TESTNET]],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

export const BIPS_BASE = JSBI.BigInt(10000)

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)
