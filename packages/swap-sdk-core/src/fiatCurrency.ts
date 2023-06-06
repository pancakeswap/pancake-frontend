import { Currency } from './currency'

/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export abstract class FiatCurrency {
  /**
   * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
   */
  public abstract readonly isFiat: boolean

  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  public readonly symbol: string

  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly name: string

  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly code: string

  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(symbol: string, name: string, code: string) {
    this.code = code
    this.symbol = symbol
    this.name = name
  }

  /**
   * Returns whether this currency is functionally equivalent to the other currency
   * @param other the other currency
   */
  public abstract equals(other: Currency): boolean

  public abstract get serialize(): { symbol: string; name: string }
}

export class FiatOnRampCurrency extends FiatCurrency {
  public readonly isFiat: boolean = true as const

  public constructor({ code, name, symbol }: { code: string; symbol: string; name: string }) {
    super(code, symbol, name)
  }

  public equals(other: Currency): boolean {
    return other.symbol === this.symbol
  }

  public get serialize(): {
    code: string
    symbol: string
    name: string
  } {
    return {
      code: this.code,
      symbol: this.symbol,
      name: this.name,
    }
  }
}
