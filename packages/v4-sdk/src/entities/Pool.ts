import { Currency, Price } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem'
import { HooksRegistration } from '../types'
import { BinPoolParameter, CLPoolParameter } from '../utils/encodePoolParameters'

export abstract class Pool {
  /**
   * The first currency of the pool by address sort order
   */
  public abstract readonly currency0: Currency

  /**
   * The second currency of the pool by address sort order
   */
  public abstract readonly currency1: Currency

  /**
   * The fee collected upon every swap in the pool, denominated in hundredths of a bip
   */
  public abstract readonly fee: bigint

  /**
   * The unserialized pool parameters
   *
   * @see {@link CLPoolParameter}
   * @see {@link BinPoolParameter}
   */
  public abstract readonly parameters: CLPoolParameter | BinPoolParameter

  /**
   * the lmPool for a poolId, address(0) if not set
   */
  public abstract readonly lmPool: Address

  protected abstract _currency0Price?: Price<Currency, Currency>

  protected abstract _currency1Price?: Price<Currency, Currency>

  /**
   * The hooks registration for the pool
   *
   * @see {@link HooksRegistration}
   */
  public get hooksRegistration(): HooksRegistration {
    return this.parameters.hooksRegistration ?? {}
  }

  /**
   * checks if the pool involves a specific currency
   *
   * @param currency currency to check
   * @returns boolean. true if the pool involves the currency
   */
  public involvesCurrency(currency: Currency): boolean {
    return currency.equals(this.currency0) || currency.equals(this.currency1)
  }

  /**
   * The current price of the first token in terms of the second token
   */
  public abstract get currency0Price(): Price<Currency, Currency>

  /**
   * The current price of the second token in terms of the first token
   */
  public abstract get currency1Price(): Price<Currency, Currency>

  /**
   * The current mid price of the pool
   */
  public priceOf(currency: Currency): Price<Currency, Currency> {
    return currency.equals(this.currency0) ? this.currency0Price : this.currency1Price
  }

  /**
   * The chain id of the pool
   */
  public get chainId(): number {
    return this.currency0.chainId
  }

  /**
   * get the input amount for a given output amount
   *
   * @param amountOut
   */
  public abstract getInputAmount(amountOut: Currency): [Currency, Pool]

  /**
   * get the output amount for a given input amount
   *
   * @param amountIn
   */
  public abstract getOutputAmount(amountIn: Currency): [Currency, Pool]

  // @fixme @ChefJerry not-implemented
  public abstract swap(...args: any[]): any
}

export abstract class CLPool extends Pool {
  /**
   * The unserialized CLPool parameters
   *
   * @see {@link CLPoolParameter}
   */
  public abstract parameters: CLPoolParameter

  /**
   * The tick spacing of the pool
   */
  public get tickSpacing(): number {
    return this.parameters.tickSpacing
  }
}

export abstract class BinPool extends Pool {
  /**
   * The unserialized BinPool parameters
   *
   * @see {@link BinPoolParameter}
   */
  public abstract parameters: BinPoolParameter

  /**
   * The bin step of the pool
   */
  public get binStep(): number {
    return this.parameters.binStep
  }
}
