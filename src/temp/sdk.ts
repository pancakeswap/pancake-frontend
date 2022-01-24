/* eslint-disable lines-between-class-members */
import { CurrencyAmount, Price, Percent, JSBI } from 'peronio-sdk'

/**
 * Represents a mint executed to the vault.
 */
export class Mint {
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: CurrencyAmount
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: CurrencyAmount
  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price

  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly feeAmount: number

  /**
   *
   * @param inputAmount Underlying asset
   * @param outputAmount Token minted
   * @param feePercent Example 5. Represents 5%
   */
  public constructor(inputAmount: CurrencyAmount, outputAmount: CurrencyAmount, feePercent: number) {
    const amount = JSBI.toNumber(inputAmount.raw)

    this.inputAmount = inputAmount
    this.outputAmount = outputAmount

    this.feeAmount = amount - amount / (1 + feePercent / 100)
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw,
    )
  }

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */
  public static exactIn(amountIn: CurrencyAmount): Mint {
    console.info(amountIn)
    return new Mint(amountIn, amountIn, 5)
  }

  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  public static exactOut(amountOut: CurrencyAmount): Mint {
    return new Mint(amountOut, amountOut, 5)
  }
}

/**
 * Represents a mint executed to the vault.
 */
export class Withdraw {
  /**
   * The input amount for the trade assuming no slippage.
   */
  public readonly inputAmount: CurrencyAmount
  /**
   * The output amount for the trade assuming no slippage.
   */
  public readonly outputAmount: CurrencyAmount
  /**
   * The price expressed in terms of output amount/input amount.
   */
  public readonly executionPrice: Price

  public constructor(inputAmount: CurrencyAmount, outputAmount: CurrencyAmount) {
    this.inputAmount = inputAmount
    this.outputAmount = outputAmount
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw,
    )
  }
}
// .subtract(inputAmount.divide(100 + feePercent) / 1))
