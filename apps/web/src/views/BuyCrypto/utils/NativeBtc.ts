import { ERC20Token } from '@pancakeswap/sdk'
import { Currency, NativeCurrency, Token } from '@pancakeswap/swap-sdk-core'

// only used as dummy to satify Currency Type
const WNATIVE_BTC = new ERC20Token(
  0,
  '0x0000000000000000000000000000000000000000',
  8,
  'WNATIVE_BTC',
  'Wrapped Native Bitcoin',
  'https://weth.io',
)

const BTC = { name: 'Bitcoin', symbol: 'BTC', decimals: 8 } as const

/**
 *
 * Native is the main usage of a 'native' currency, i.e. for BSC mainnet and all testnets
 */
export class NativeBtc extends NativeCurrency {
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

  // eslint-disable-next-line class-methods-use-this
  public get wrapped(): Token {
    return WNATIVE_BTC
  }

  public static onChain(): NativeBtc {
    const { decimals, name, symbol } = BTC
    return new NativeBtc({ chainId: 0, decimals, symbol, name })
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
