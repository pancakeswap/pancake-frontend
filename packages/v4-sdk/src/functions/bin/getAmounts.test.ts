import { WNATIVE } from '@pancakeswap/sdk'
import { maxUint128 } from 'viem'
import { beforeEach, describe, expect, test } from 'vitest'
import { MAX_PROTOCOL_FEE, TEN_PERCENT_FEE } from '../../constants/fee'
import { BinPoolState } from './createBinPool'
import { getAmounts } from './getAmounts'

// const getRandomFee = () => {
//   const random = Math.random()
//   return BigInt(Math.floor(random * Number(TEN_PERCENT_FEE)))
// }

// const getRandomActiveId = () => {
//   const random = Math.random()
//   return BigInt(Math.floor(random * Number(maxUint24)))
// }
const getRandom = (max: number, min = 0): bigint => {
  const random = Math.random()
  return BigInt(Math.floor(random * (max - min) + min))
}

const createBinPool = (
  activeId: bigint,
  reserveX: bigint,
  reserveY: bigint,
  lpFee: bigint,
  protocolFees: [bigint, bigint]
): BinPoolState => {
  return {
    currencyX: WNATIVE[56],
    currencyY: WNATIVE[56],
    activeId,
    binStep: 10n,
    lpFee,
    protocolFees,
    reserveOfBin: {
      [Number(activeId)]: { reserveX, reserveY },
    },
  }
}

describe('getAmounts', () => {
  let lpFee: bigint
  let protocolFees: [bigint, bigint] = [0n, 0n]
  const activeId = 8388611n
  let reserveX: bigint
  let reserveY: bigint
  let amountIn: bigint

  beforeEach(() => {
    lpFee = 0n
    protocolFees = [0n, 0n]
    reserveX = 0n
    reserveY = 0n
    amountIn = 0n
  })

  test('swapForY = true', () => {
    const swapForY = true
    lpFee = 72n
    reserveX = 2542815942178n
    reserveY = 90306738043836369n
    amountIn = 340282366920938463463374607431768211452n

    const binPool = createBinPool(activeId, reserveX, reserveY, lpFee, protocolFees)

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, swapForY, amountIn)

    expect(amountsInWithFee[swapForY ? 0 : 1]).toBeLessThanOrEqual(amountIn)

    expect(amountsInWithFee).toEqual([90042841853031869n, 0n])
    expect(amountsOutOfBin).toEqual([0n, 90306738043836369n])
    expect(totalFees).toEqual([6483084613419n, 0n])
  })
  test('swapForY = false', () => {
    const swapForY = false
    lpFee = 72n
    reserveX = 2542815942178n
    reserveY = 90306738043836369n
    amountIn = 340282366920938463463374607431768211452n

    const binPool = createBinPool(activeId, reserveX, reserveY, lpFee, protocolFees)

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, swapForY, amountIn)

    expect(amountsInWithFee[1]).toBeLessThanOrEqual(amountIn)
    expect(amountsInWithFee).toEqual([0n, 2550635666765n])
    expect(amountsOutOfBin).toEqual([2542815942178n, 0n])
    expect(totalFees).toEqual([0n, 183645769n])
  })
  test('fuzzing', () => {
    lpFee = getRandom(Number(TEN_PERCENT_FEE))
    protocolFees = [getRandom(Number(MAX_PROTOCOL_FEE)), getRandom(Number(MAX_PROTOCOL_FEE))]
    reserveX = getRandom(Number(maxUint128))
    reserveY = getRandom(Number(maxUint128))
    amountIn = getRandom(Number(maxUint128))

    const binPool = createBinPool(activeId, reserveX, reserveY, lpFee, protocolFees)

    const swapForY = Math.random() > 0.5

    const {
      amountsInWithFee,
      // amountsOutOfBin,
      // totalFees
    } = getAmounts(binPool, swapForY, amountIn)

    expect(amountsInWithFee[swapForY ? 0 : 1]).toBeLessThanOrEqual(amountIn)
  })
})
