import { FeeAmount } from '../constants'
import { NEGATIVE_ONE, ZERO, MAX_FEE } from '../internalConstants'
import { FullMath } from './fullMath'
import { SqrtPriceMath } from './sqrtPriceMath'

export abstract class SwapMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static computeSwapStep(
    sqrtRatioCurrentX96: bigint,
    sqrtRatioTargetX96: bigint,
    liquidity: bigint,
    amountRemaining: bigint,
    feePips: FeeAmount
  ): [bigint, bigint, bigint, bigint] {
    const returnValues: Partial<{
      sqrtRatioNextX96: bigint
      amountIn: bigint
      amountOut: bigint
      feeAmount: bigint
    }> = {}

    const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96
    const exactIn = amountRemaining >= ZERO

    if (exactIn) {
      const amountRemainingLessFee = (amountRemaining * (MAX_FEE - BigInt(feePips))) / MAX_FEE
      returnValues.amountIn = zeroForOne
        ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true)
        : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true)
      if (amountRemainingLessFee >= returnValues.amountIn!) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemainingLessFee,
          zeroForOne
        )
      }
    } else {
      returnValues.amountOut = zeroForOne
        ? SqrtPriceMath.getAmount1Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, false)
        : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, false)
      if (amountRemaining * NEGATIVE_ONE >= returnValues.amountOut) {
        returnValues.sqrtRatioNextX96 = sqrtRatioTargetX96
      } else {
        returnValues.sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemaining * NEGATIVE_ONE,
          zeroForOne
        )
      }
    }

    const max = sqrtRatioTargetX96 === returnValues.sqrtRatioNextX96

    if (zeroForOne) {
      returnValues.amountIn =
        max && exactIn
          ? returnValues.amountIn
          : SqrtPriceMath.getAmount0Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, true)
      returnValues.amountOut =
        max && !exactIn
          ? returnValues.amountOut
          : SqrtPriceMath.getAmount1Delta(returnValues.sqrtRatioNextX96, sqrtRatioCurrentX96, liquidity, false)
    } else {
      returnValues.amountIn =
        max && exactIn
          ? returnValues.amountIn
          : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, true)
      returnValues.amountOut =
        max && !exactIn
          ? returnValues.amountOut
          : SqrtPriceMath.getAmount0Delta(sqrtRatioCurrentX96, returnValues.sqrtRatioNextX96, liquidity, false)
    }

    if (!exactIn && returnValues.amountOut! > amountRemaining * NEGATIVE_ONE) {
      returnValues.amountOut = amountRemaining * NEGATIVE_ONE
    }

    if (exactIn && returnValues.sqrtRatioNextX96 !== sqrtRatioTargetX96) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      returnValues.feeAmount = amountRemaining - returnValues.amountIn!
    } else {
      returnValues.feeAmount = FullMath.mulDivRoundingUp(
        returnValues.amountIn!,
        BigInt(feePips),
        MAX_FEE - BigInt(feePips)
      )
    }

    return [returnValues.sqrtRatioNextX96!, returnValues.amountIn!, returnValues.amountOut!, returnValues.feeAmount!]
  }
}
