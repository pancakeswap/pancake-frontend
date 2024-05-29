import invariant from 'tiny-invariant'
import { Currency, Token, NativeCurrency } from '@pancakeswap/swap-sdk-core'

import { WNATIVE, NATIVE } from '../constants'

/**
 *
 * Native is the main usage of a 'native' currency, i.e. for BSC mainnet and all testnets
 */
export class Native extends NativeCurrency {
  protected constructor({
    chainId,
    decimals,
    name,
    symbol,
  }: {
    chainId: number
    decimals: number
    symbol: string
    name: string
  }) {
    super(chainId, decimals, symbol, name)
  }

  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId as keyof typeof WNATIVE]
    invariant(!!wnative, 'WRAPPED')
    return wnative
  }

  private static cache: { [chainId: number]: Native } = {}

  public static onChain(chainId: number): Native {
    if (chainId in this.cache) {
      return this.cache[chainId]
    }
    invariant(!!NATIVE[chainId as keyof typeof NATIVE], 'NATIVE_CURRENCY')
    const { decimals, name, symbol } = NATIVE[chainId as keyof typeof WNATIVE]
    // eslint-disable-next-line no-return-assign
    return (this.cache[chainId] = new Native({ chainId, decimals, symbol, name }))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
