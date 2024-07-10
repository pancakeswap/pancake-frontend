/* eslint-disable no-param-reassign */
/* eslint-disable no-constant-condition */
import invariant from 'tiny-invariant'
import { maxUint24 } from 'viem'
import { SCALE_OFFSET } from '../../constants/binPool'
import { calculateSwapFee } from '../../utils/calculateSwapFee'
import { mulShiftRoundUp } from '../../utils/math/mulShift'
import { shiftDivRoundUp } from '../../utils/math/shiftDiv'
import { BinPoolState } from './createBinPool'
import { getAmounts } from './getAmounts'
import { getExternalFeeAmt } from './getExternalFeeAmt'
import { getFeeAmount } from './getFeeAmount'
import { getNextNonEmptyBin } from './getNextNonEmptyBin'
import { getPriceFromId } from './getPriceFromId'

/**
 * dryrun of swap to a given bin pool
 */
export const swap = (
  binPool: BinPoolState,
  amountIn: bigint,
  swapForY: boolean
): {
  binPool: BinPoolState
  feeForProtocol: bigint
  result: [bigint, bigint]
} => {
  invariant(amountIn > 0n, 'INSUFFICIENT_AMOUNT_IN')

  const inside = swapForY ? '0' : '1'
  const outside = swapForY ? '1' : '0'
  const { protocolFees } = binPool
  let { activeId } = binPool
  let amountLeft = amountIn
  let amountOut = 0n
  let feeForProtocol = 0n
  const swapFee = calculateSwapFee(protocolFees[swapForY ? 0 : 1], binPool.lpFee)

  while (true) {
    const binReserves = binPool.reserveOfBin[Number(activeId)]
    const binReserveTarget = swapForY ? binReserves.reserveY : binReserves.reserveX

    if (binReserveTarget) {
      const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(
        { ...binPool, activeId },
        swapForY,
        amountLeft
      )

      if (amountsInWithFee[0] + amountsInWithFee[1] > 0n) {
        amountLeft -= amountsInWithFee[inside]
        amountOut += amountsOutOfBin[outside]

        // (totalFee * protocolFee) / (protocolFee + lpFee)
        // get aggregated fee for protocol
        const pFees = getExternalFeeAmt(totalFees, protocolFees, swapFee)
        feeForProtocol += pFees[inside]
        const amountInWithFee = amountsInWithFee[inside] - pFees[inside]
        binPool.reserveOfBin[Number(activeId)][`reserve${swapForY ? 'X' : 'Y'}`] += amountInWithFee
        binPool.reserveOfBin[Number(activeId)][`reserve${swapForY ? 'Y' : 'X'}`] -= amountsOutOfBin[inside]
      }
    }

    if (amountLeft === 0n) {
      break
    } else {
      const nextId = getNextNonEmptyBin(binPool, activeId, swapForY)
      if (nextId === 0n || nextId === maxUint24) {
        throw new Error('OUT_OF_LIQUIDITY')
      }
      activeId = nextId
    }
  }

  if (amountOut === 0n) {
    throw new Error('INSUFFICIENT_AMOUNT_OUT')
  }

  binPool.activeId = activeId

  let result: [bigint, bigint] = [0n, 0n]
  const consumed = amountIn - amountLeft
  result = swapForY ? [consumed, -amountOut] : [-amountOut, consumed]

  return {
    binPool,
    feeForProtocol,
    result,
  }
}

export const getSwapIn = (binPool: BinPoolState, amountOut: bigint, swapForY: boolean) => {
  let id = binPool.activeId
  let amountOutLeft = amountOut
  let amountIn = 0n
  let fee = 0n
  const swapFee = calculateSwapFee(binPool.protocolFees[swapForY ? 0 : 1], binPool.lpFee)

  while (true) {
    const { reserveX, reserveY } = binPool.reserveOfBin[Number(id)]
    const reserve = swapForY ? reserveY : reserveX
    if (reserve > 0n) {
      const price = getPriceFromId(id, binPool.binStep)

      const amountOutOfBin = reserve > amountOutLeft ? amountOutLeft : reserve
      const amountInWithoutFee = swapForY
        ? shiftDivRoundUp(amountOutOfBin, SCALE_OFFSET, price)
        : mulShiftRoundUp(amountOutOfBin, price, SCALE_OFFSET)

      const feeAmount = getFeeAmount(amountInWithoutFee, swapFee)

      amountIn += amountInWithoutFee + feeAmount
      amountOutLeft -= amountOutOfBin

      fee += feeAmount
    }

    if (amountOutLeft === 0n) {
      break
    } else {
      const nextId = getNextNonEmptyBin(binPool, id, swapForY)
      if (nextId === 0n || nextId === maxUint24) break
      id = nextId
    }
  }

  return {
    amountIn,
    fee,
    amountOutLeft,
  }
}

export const getSwapOut = (binPool: BinPoolState, amountIn: bigint, swapForY: boolean) => {
  let id = binPool.activeId
  let amountInLeft = amountIn
  let amountOut = 0n
  let fee = 0n

  while (true) {
    const { reserveX, reserveY } = binPool.reserveOfBin[Number(id)]
    const reserve = swapForY ? reserveY : reserveX
    if (reserve > 0n) {
      const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(
        {
          ...binPool,
          activeId: id,
        },
        swapForY,
        amountInLeft
      )
      const inside = swapForY ? '0' : '1'
      const outside = swapForY ? '1' : '0'

      if (amountsInWithFee[inside] > 0) {
        amountInLeft -= amountsInWithFee[inside]
        amountOut += amountsOutOfBin[outside]
        fee += totalFees[inside]
      }
    }

    if (amountInLeft === 0n) {
      break
    } else {
      const nextId = getNextNonEmptyBin(binPool, id, swapForY)
      if (nextId === 0n || nextId === maxUint24) break
      id = nextId
    }
  }

  return {
    amountOut,
    fee,
    amountInLeft,
  }
}
