import invariant from 'tiny-invariant'
import { maxUint24 } from 'viem'
import { SCALE_OFFSET } from '../../constants/binPool'
import { mulShiftRoundUp } from '../../utils/math/mulShift'
import { shiftDivRoundUp } from '../../utils/math/shiftDiv'
import { getAmounts } from './getAmounts'
import { BinPoolState } from './getBinPool'
import { getExternalFeeAmt } from './getExternalFeeAmt'
import { getFeeAmount } from './getFeeAmount'
import { getNextNonEmptyBin } from './getNextNonEmptyBin'
import { getPriceFromId } from './getPriceFromId'

/**
 * dryrun of swap
 */
export const swap = (
  binPool: BinPoolState,
  amountIn: bigint,
  zeroForOne: boolean
): {
  binPool: BinPoolState
  result: [bigint, bigint]
} => {
  invariant(amountIn > 0n, 'INSUFFICIENT_AMOUNT_IN')

  const inside = zeroForOne ? '0' : '1'
  const outside = zeroForOne ? '1' : '0'
  const { protocolFee } = binPool
  let { activeId } = binPool
  let amountLeft = amountIn
  let amountOut = 0n
  let feeForProtocol = 0n

  while (true) {
    const binReserves = binPool.reserveOfBin[Number(activeId)]
    const binReserveTarget = zeroForOne ? binReserves.reserve1 : binReserves.reserve0

    if (binReserveTarget) {
      const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(
        { ...binPool, activeId },
        zeroForOne,
        amountLeft
      )

      if (amountsInWithFee[0] + amountsInWithFee[1] > 0n) {
        amountLeft -= amountsInWithFee[inside]
        amountOut += amountsOutOfBin[outside]

        const protocolFees = getExternalFeeAmt(totalFees, protocolFee)
        feeForProtocol += protocolFees[inside]
        const amountInWithFee = amountsInWithFee[inside] - protocolFees[inside]
        binPool.reserveOfBin[Number(activeId)][`reserve${inside}`] += amountInWithFee
        binPool.reserveOfBin[Number(activeId)][`reserve${outside}`] -= amountsOutOfBin[inside]
      }
    }

    if (amountLeft === 0n) {
      break
    } else {
      const nextId = getNextNonEmptyBin(binPool, activeId, zeroForOne)
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
  result = zeroForOne ? [consumed, -amountOut] : [-amountOut, consumed]

  return {
    binPool,
    result,
  }
}

export const getSwapIn = (binPool: BinPoolState, amountOut: bigint, zeroForOne: bool) => {
  let id = binPool.activeId
  let amountOutLeft = amountOut
  let amountIn = 0n
  let fee = 0n

  while (true) {
    const { reserve0, reserve1 } = binPool.reserveOfBin[Number(id)]
    const reserve = zeroForOne ? reserve1 : reserve0
    if (reserve > 0n) {
      const price = getPriceFromId(id, binPool.binStep)

      const amountOutOfBin = reserve > amountOutLeft ? amountOutLeft : reserve
      const amountInWithoutFee = zeroForOne
        ? shiftDivRoundUp(amountOutOfBin, SCALE_OFFSET, price)
        : mulShiftRoundUp(amountOutOfBin, price, SCALE_OFFSET)

      const feeAmount = getFeeAmount(amountInWithoutFee, binPool.swapFee)

      amountIn += amountInWithoutFee + feeAmount
      amountOutLeft -= amountOutOfBin

      fee += feeAmount
    }

    if (amountOutLeft === 0n) {
      break
    } else {
      const nextId = getNextNonEmptyBin(binPool, id, zeroForOne)
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

export const getSwapOut = (binPool: BinPoolState, amountIn: bigint, zeroForOne: bool) => {
  let id = binPool.activeId
  let amountInLeft = amountIn
  let amountOut = 0n
  let fee = 0n

  while (true) {
    const { reserve0, reserve1 } = binPool.reserveOfBin[Number(id)]
    const reserve = zeroForOne ? reserve1 : reserve0
    if (reserve > 0n) {
      const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(
        {
          ...binPool,
          activeId: id,
        },
        zeroForOne,
        amountInLeft
      )
      const inside = zeroForOne ? '0' : '1'
      const outside = zeroForOne ? '1' : '0'

      if (amountsInWithFee[inside] > 0) {
        amountInLeft -= amountsInWithFee[inside]
        amountOut += amountsOutOfBin[outside]
        fee += totalFees[inside]
      }
    }

    if (amountInLeft === 0n) {
      break
    } else {
      const nextId = getNextNonEmptyBin(binPool, id, zeroForOne)
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
