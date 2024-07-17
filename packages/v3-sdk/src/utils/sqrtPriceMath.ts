import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { ONE, ZERO, Q96 } from '../internalConstants'
import { FullMath } from './fullMath'

const MaxUint160 = 2n ** 160n - ONE

function multiplyIn256(x: bigint, y: bigint): bigint {
  const product = x * y
  return product & MaxUint256
}

function addIn256(x: bigint, y: bigint): bigint {
  const sum = x + y
  return sum & MaxUint256
}

export abstract class SqrtPriceMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static getAmount0Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }

    const numerator1 = liquidity << 96n
    const numerator2 = sqrtRatioBX96 - sqrtRatioAX96

    return roundUp
      ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96)
      : (numerator1 * numerator2) / sqrtRatioBX96 / sqrtRatioAX96
  }

  public static getAmount1Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }

    return roundUp
      ? FullMath.mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, Q96)
      : (liquidity * (sqrtRatioBX96 - sqrtRatioAX96)) / Q96
  }

  public static getNextSqrtPriceFromInput(
    sqrtPX96: bigint,
    liquidity: bigint,
    amountIn: bigint,
    zeroForOne: boolean
  ): bigint {
    invariant(sqrtPX96 > ZERO)
    invariant(liquidity > ZERO)

    return zeroForOne
      ? this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountIn, true)
      : this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountIn, true)
  }

  public static getNextSqrtPriceFromOutput(
    sqrtPX96: bigint,
    liquidity: bigint,
    amountOut: bigint,
    zeroForOne: boolean
  ): bigint {
    invariant(sqrtPX96 > ZERO)
    invariant(liquidity > ZERO)

    return zeroForOne
      ? this.getNextSqrtPriceFromAmount1RoundingDown(sqrtPX96, liquidity, amountOut, false)
      : this.getNextSqrtPriceFromAmount0RoundingUp(sqrtPX96, liquidity, amountOut, false)
  }

  private static getNextSqrtPriceFromAmount0RoundingUp(
    sqrtPX96: bigint,
    liquidity: bigint,
    amount: bigint,
    add: boolean
  ): bigint {
    if (amount === ZERO) return sqrtPX96
    const numerator1 = liquidity << 96n

    if (add) {
      const product = multiplyIn256(amount, sqrtPX96)
      if (product / amount === sqrtPX96) {
        const denominator = addIn256(numerator1, product)
        if (denominator >= numerator1) {
          return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator)
        }
      }

      return FullMath.mulDivRoundingUp(numerator1, ONE, numerator1 / sqrtPX96 + amount)
    }
    const product = multiplyIn256(amount, sqrtPX96)

    invariant(product / amount === sqrtPX96)
    invariant(numerator1 > product)
    const denominator = numerator1 - product
    return FullMath.mulDivRoundingUp(numerator1, sqrtPX96, denominator)
  }

  private static getNextSqrtPriceFromAmount1RoundingDown(
    sqrtPX96: bigint,
    liquidity: bigint,
    amount: bigint,
    add: boolean
  ): bigint {
    if (add) {
      const quotient = amount <= MaxUint160 ? (amount << 96n) / liquidity : (amount * Q96) / liquidity

      return sqrtPX96 + quotient
    }
    const quotient = FullMath.mulDivRoundingUp(amount, Q96, liquidity)

    invariant(sqrtPX96 > quotient)
    return sqrtPX96 - quotient
  }
}
