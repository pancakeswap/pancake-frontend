import { WNATIVE } from '@pancakeswap/sdk'
import { maxUint128 } from 'viem'
import { beforeEach, describe, expect, test } from 'vitest'
import { TEN_PERCENT_FEE } from '../../constants/fee'
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

const createBinPool = (swapFee: bigint, activeId: bigint, reserve0: bigint, reserve1: bigint) => {
  return {
    currency0: WNATIVE[56],
    currency1: WNATIVE[56],
    activeId,
    binStep: 10n,
    swapFee,
    reserveOfBin: {
      [Number(activeId)]: { reserve0, reserve1 },
    },
  }
}

describe('getAmounts', () => {
  let fee
  const activeId = 8388611n
  let reserve0
  let reserve1
  let amountIn

  beforeEach(() => {
    fee = 0n
    reserve0 = 0n
    reserve1 = 0n
    amountIn = 0n
  })

  test('zeroForOne = true', () => {
    const zeroForOne = true
    fee = 72n
    reserve0 = 2542815942178n
    reserve1 = 90306738043836369n
    amountIn = 340282366920938463463374607431768211452n

    const binPool = createBinPool(fee, activeId, reserve0, reserve1)

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, zeroForOne, amountIn)

    expect(amountsInWithFee[zeroForOne ? 0 : 1]).toBeLessThanOrEqual(amountIn)

    expect(amountsInWithFee).toEqual([90042841853031869n, 0n])
    expect(amountsOutOfBin).toEqual([0n, 90306738043836369n])
    expect(totalFees).toEqual([6483084613419n, 0n])
  })
  test('zeroForOne = false', () => {
    const zeroForOne = false
    fee = 72n
    reserve0 = 2542815942178n
    reserve1 = 90306738043836369n
    amountIn = 340282366920938463463374607431768211452n

    const binPool = createBinPool(fee, activeId, reserve0, reserve1)

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, zeroForOne, amountIn)

    expect(amountsInWithFee[1]).toBeLessThanOrEqual(amountIn)
    expect(amountsInWithFee).toEqual([0n, 2550635666765n])
    expect(amountsOutOfBin).toEqual([2542815942178n, 0n])
    expect(totalFees).toEqual([0n, 183645769n])
  })
  test('fuzzing', () => {
    fee = getRandom(Number(TEN_PERCENT_FEE))
    reserve0 = getRandom(Number(maxUint128))
    reserve1 = getRandom(Number(maxUint128))
    amountIn = getRandom(Number(maxUint128))

    const binPool = createBinPool(fee, activeId, reserve0, reserve1)

    const zeroForOne = Math.random() > 0.5

    const { amountsInWithFee, amountsOutOfBin, totalFees } = getAmounts(binPool, zeroForOne, amountIn)

    expect(amountsInWithFee[zeroForOne ? 0 : 1]).toBeLessThanOrEqual(amountIn)
  })
})
