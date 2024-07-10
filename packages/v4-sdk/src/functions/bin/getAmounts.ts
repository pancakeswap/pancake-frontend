import { SCALE_OFFSET } from '../../constants/binPool'
import { calculateSwapFee } from '../../utils/calculateSwapFee'
import { mulShiftRoundDown, mulShiftRoundUp } from '../../utils/math/mulShift'
import { shiftDivRoundDown, shiftDivRoundUp } from '../../utils/math/shiftDiv'
import { BinPoolState } from './createBinPool'
import { getFeeAmount } from './getFeeAmount'
import { getFeeAmountFrom } from './getFeeAmountFrom'
import { getPriceFromId } from './getPriceFromId'

export type AmountsChanged = {
  /**
   * The amounts of tokens that will be added to the pool, including fees
   */
  amountsInWithFee: [bigint, bigint]
  /**
   * The amounts of tokens that will be removed from the pool
   */
  amountsOutOfBin: [bigint, bigint]
  /**
   * The fees that will be charged
   */
  totalFees: [bigint, bigint]
}

/**
 * Returns the amounts of tokens that will be added and removed from the bin during a swap
 * along with the fees that will be charged
 *
 * @param binPool BinPoolState
 * @param swapForY boolean
 * @param amountIn bigint
 * @returns AmountsChanged
 */
export const getAmounts = (binPool: BinPoolState, swapForY: boolean, amountIn: bigint): AmountsChanged => {
  let amountInWithFee = amountIn
  let amountOutOfBin = 0n
  let totalFee = 0n

  const binReserves = binPool.reserveOfBin[Number(binPool.activeId)]

  const price = getPriceFromId(binPool.activeId, binPool.binStep)
  const binReserveOut = swapForY ? binReserves.reserveY : binReserves.reserveX

  let maxAmountIn = swapForY
    ? shiftDivRoundUp(binReserveOut, SCALE_OFFSET, price)
    : mulShiftRoundUp(binReserveOut, price, SCALE_OFFSET)

  const protocolFee = binPool.protocolFees[swapForY ? 0 : 1]
  const swapFee = calculateSwapFee(protocolFee, binPool.lpFee)

  const maxFee = getFeeAmount(maxAmountIn, swapFee)

  maxAmountIn += maxFee

  if (amountIn >= maxAmountIn) {
    totalFee = maxFee
    amountInWithFee = maxAmountIn
    amountOutOfBin = binReserveOut
  } else {
    totalFee = getFeeAmountFrom(amountIn, swapFee)
    const amountsInWithoutFee = amountIn - totalFee

    amountOutOfBin = swapForY
      ? mulShiftRoundDown(amountsInWithoutFee, price, SCALE_OFFSET)
      : shiftDivRoundDown(amountsInWithoutFee, SCALE_OFFSET, price)

    if (amountOutOfBin > binReserveOut) {
      amountOutOfBin = binReserveOut
    }
  }

  return {
    amountsInWithFee: swapForY ? [amountInWithFee, 0n] : [0n, amountInWithFee],
    amountsOutOfBin: swapForY ? [0n, amountOutOfBin] : [amountOutOfBin, 0n],
    totalFees: swapForY ? [totalFee, 0n] : [0n, totalFee],
  }
}
