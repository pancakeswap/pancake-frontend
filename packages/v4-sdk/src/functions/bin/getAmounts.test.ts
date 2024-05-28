import { WNATIVE } from '@pancakeswap/sdk'
import { maxUint128 } from 'viem'
import { beforeEach, describe, expect, test } from 'vitest'
import { TEN_PERCENT_FEE } from '../../constants/fee'
import { getAmounts } from './getAmounts'
import { BinPoolState } from './getBinPool'

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

const createBinPool = (swapFee: bigint, activeId: bigint, reserveX: bigint, reserveY: bigint): BinPoolState => {
  return {
    currencyX: WNATIVE[56],
    currencyY: WNATIVE[56],
    activeId,
    binStep: 10n,
    swapFee,
    reserveOfBin: {
      [Number(activeId)]: { reserveX, reserveY },
    },
  } as BinPoolState
}

describe('getAmounts', () => {
  let fee
  const activeId = 8388611n
  let reserveX
  let reserveY
  let amountIn

  beforeEach(() => {
    fee = 0n
    reserveX = 0n
    reserveY = 0n
    amountIn = 0n
  })

  test('swapForY = true', () => {
    const swapForY = true
    fee = 72n
    reserveX = 2542815942178n
    reserveY = 90306738043836369n
    amountIn = 340282366920938463463374607431768211452n

    const binPool = createBinPool(fee, activeId, reserveX, reserveY)

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, swapForY, amountIn)

    expect(amountsInWithFee[swapForY ? 0 : 1]).toBeLessThanOrEqual(amountIn)

    expect(amountsInWithFee).toEqual([90042841853031869n, 0n])
    expect(amountsOutOfBin).toEqual([0n, 90306738043836369n])
    expect(totalFees).toEqual([6483084613419n, 0n])
  })
  test('swapForY = false', () => {
    const swapForY = false
    fee = 72n
    reserveX = 2542815942178n
    reserveY = 90306738043836369n
    amountIn = 340282366920938463463374607431768211452n

    const binPool = createBinPool(fee, activeId, reserveX, reserveY)

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, swapForY, amountIn)

    expect(amountsInWithFee[1]).toBeLessThanOrEqual(amountIn)
    expect(amountsInWithFee).toEqual([0n, 2550635666765n])
    expect(amountsOutOfBin).toEqual([2542815942178n, 0n])
    expect(totalFees).toEqual([0n, 183645769n])
  })
  test('fuzzing', () => {
    fee = getRandom(Number(TEN_PERCENT_FEE))
    reserveX = getRandom(Number(maxUint128))
    reserveY = getRandom(Number(maxUint128))
    amountIn = getRandom(Number(maxUint128))

    const binPool = createBinPool(fee, activeId, reserveX, reserveY)

    const swapForY = Math.random() > 0.5

    const {
      amountsInWithFee,
      // amountsOutOfBin,
      // totalFees
    } = getAmounts(binPool, swapForY, amountIn)

    expect(amountsInWithFee[swapForY ? 0 : 1]).toBeLessThanOrEqual(amountIn)
  })
})
