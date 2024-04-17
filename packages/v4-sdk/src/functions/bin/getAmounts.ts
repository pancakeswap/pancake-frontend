import { SCALE_OFFSET } from '../../constants/binPool'
import { mulShiftRoundDown, mulShiftRoundUp } from '../../utils/math/mulShift'
import { shiftDivRoundDown, shiftDivRoundUp } from '../../utils/math/shiftDiv'
import { BinPoolState } from './getBinPool'
import { getFeeAmount } from './getFeeAmount'
import { getFeeAmountFrom } from './getFeeAmountFrom'
import { getPriceFromId } from './getPriceFromId'

export const getAmounts = (
  binPool: BinPoolState,
  zeroForOne: boolean,
  amountIn: bigint
): {
  /**
   * The amounts of tokens that will be added to the pool, including fees
   */
  amountsInWithFee: [bigint, bigint]
  /**
   * The amounts of tokens that will be removed from the pool
   */
  amountsOutOfBin: [bigint, bigint]
  totalFees: [bigint, bigint]
} => {
  let amountInWithFee = amountIn
  let amountOutOfBin = 0n
  let totalFee = 0n

  const binReserves = binPool.reserveOfBin[Number(binPool.activeId)]

  const price = getPriceFromId(binPool.activeId, binPool.binStep)
  const binReserveOut = zeroForOne ? binReserves.reserve1 : binReserves.reserve0

  let maxAmountIn = zeroForOne
    ? shiftDivRoundUp(binReserveOut, SCALE_OFFSET, price)
    : mulShiftRoundUp(binReserveOut, price, SCALE_OFFSET)

  const maxFee = getFeeAmount(maxAmountIn, binPool.swapFee)

  maxAmountIn += maxFee

  if (amountIn >= maxAmountIn) {
    totalFee = maxFee
    amountInWithFee = maxAmountIn
    amountOutOfBin = binReserveOut
  } else {
    totalFee = getFeeAmountFrom(amountIn, binPool.swapFee)
    const amountsInWithoutFee = amountIn - totalFee

    amountOutOfBin = zeroForOne
      ? mulShiftRoundDown(amountsInWithoutFee, price, SCALE_OFFSET)
      : shiftDivRoundDown(amountsInWithoutFee, SCALE_OFFSET, price)

    if (amountOutOfBin > binReserveOut) {
      amountOutOfBin = binReserveOut
    }
  }

  return {
    amountsInWithFee: zeroForOne ? [amountInWithFee, 0n] : [0n, amountInWithFee],
    amountsOutOfBin: zeroForOne ? [0n, amountOutOfBin] : [amountOutOfBin, 0n],
    totalFees: zeroForOne ? [totalFee, 0n] : [0n, totalFee],
  }
}
