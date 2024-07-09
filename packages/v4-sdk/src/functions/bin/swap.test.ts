import { WNATIVE } from '@pancakeswap/sdk'
import { describe, expect, test } from 'vitest'
import { TreeMath } from '../../utils/math/TreeMath'
import { BinPoolState } from './createBinPool'
import { getSwapIn, getSwapOut, swap } from './swap'

describe('swap', () => {
  const activeId = 2n ** 23n
  const currencyX = WNATIVE[56]
  const currencyY = WNATIVE[56]
  const lpFee = 3000n
  const binStep = 10n

  const defaultBinPool: BinPoolState = {
    activeId,
    currencyX,
    currencyY,
    binStep,
    lpFee,
    protocolFees: [0n, 0n],
    reserveOfBin: {},
  }

  const setLiquidityToBin = (binPool: BinPoolState, id: bigint, amount0: bigint, amount1: bigint) => {
    // eslint-disable-next-line no-param-reassign
    binPool.reserveOfBin[Number(id)] = {
      reserveX: amount0,
      reserveY: amount1,
    }
    if (!binPool.tree)
      // eslint-disable-next-line no-param-reassign
      binPool.tree = {
        level0: '0x0',
        level1: {},
        level2: {},
      }
    TreeMath.add(binPool.tree, id)
  }
  const setLiquidity = (
    binPool: BinPoolState,
    id: bigint,
    amount0: bigint,
    amount1: bigint,
    nbBinX: bigint,
    nbBinY: bigint
  ) => {
    const xStep = amount0 / nbBinX
    const yStep = amount1 / nbBinY

    setLiquidityToBin(binPool, id, xStep, yStep)

    for (let i = 1n; i <= nbBinX; i++) {
      setLiquidityToBin(binPool, id + i, xStep, 0n)
    }
    for (let i = 1n; i <= nbBinY; i++) {
      setLiquidityToBin(binPool, id - i, 0n, yStep)
    }
  }

  test('getSwapIn::swapForY', () => {
    const swapForY = true
    const bin: BinPoolState = { ...defaultBinPool, protocolFees: [0n, 0n] }
    const amountOut = BigInt(1e18 - 1)
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const { amountIn, amountOutLeft } = getSwapIn(bin, amountOut, swapForY)

    expect(amountOutLeft).toBe(0n)

    const { result } = swap(bin, amountIn, swapForY)
    expect(result[0]).toBe(amountIn)
    expect(result[1]).toBe(-amountOut)
  })

  test('getSwapIn::swapForY 0.1% protocolFee + 0.3% lpFee', () => {
    const swapForY = true
    const bin: BinPoolState = { ...defaultBinPool, protocolFees: [1000n, 1000n] }
    const amountOut = BigInt(1e18 - 1)
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const { amountIn, amountOutLeft } = getSwapIn(bin, amountOut, swapForY)

    expect(amountOutLeft).toBe(0n)

    const { result } = swap(bin, amountIn, swapForY)
    expect(result[0]).toBe(amountIn)
    expect(result[1]).toBe(-amountOut)
  })

  test('getSwapIn::swapForX', () => {
    const bin = { ...defaultBinPool }
    const amountOut = BigInt(1e18) - 1n

    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const { amountIn, amountOutLeft } = getSwapIn(bin, amountOut, false)

    expect(amountIn).toBe(1027980590466421793n)
    expect(amountOutLeft).toBe(0n)

    const { result } = swap(bin, amountIn, false)
    expect(result[1]).toBe(amountIn)
    expect(result[0]).toBe(-amountOut)
  })

  test('getSwapOut::swapForY', () => {
    const bin = { ...defaultBinPool }
    const amountIn = BigInt(1e18)
    const swapForY = true
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const { amountOut, amountInLeft } = getSwapOut(bin, amountIn, swapForY)

    expect(amountOut).toBeGreaterThan(0n)
    expect(amountInLeft).toBe(0n)

    const { result } = swap(bin, amountIn, swapForY)
    expect(result[0]).toBe(amountIn)
    expect(result[1]).toBe(-amountOut)
  })
  test('getSwapOut::swapForX', () => {
    const bin = { ...defaultBinPool }
    const amountIn = BigInt(1e18)
    const swapForY = false
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const { amountOut, amountInLeft } = getSwapOut(bin, amountIn, swapForY)

    expect(amountOut).toBeGreaterThan(0n)
    expect(amountInLeft).toBe(0n)

    const { result } = swap(bin, amountIn, swapForY)
    expect(result[0]).toBe(-amountOut)
    expect(result[1]).toBe(amountIn)
  })

  test('swapIn and swapOut single bin', () => {
    const bin = { ...defaultBinPool }
    setLiquidityToBin(bin, bin.activeId, BigInt(1e18), BigInt(1e18))

    const { amountIn, fee: fee1, amountOutLeft } = getSwapIn(bin, BigInt(1e18), true)
    expect(amountIn).toBe(1003009027081243732n) // 1e18 + 0.3% fee
    expect(amountOutLeft).toBe(0n)
    expect(fee1).toBe(3009027081243732n)
    expect(amountIn - fee1).toBe(BigInt(1e18))

    const { amountOut, fee: fee2, amountInLeft } = getSwapOut(bin, amountIn, true)
    expect(amountInLeft).toBe(0n)
    expect(amountOut).toBe(BigInt(1e18))
    expect(fee2).toBe(fee1)

    const { result } = swap(bin, amountIn, true)
    expect(result[0]).toBe(amountIn)
    expect(result[1]).toBe(-BigInt(1e18))
  })

  test('swapIn and swapOut multiple bins', () => {
    const bin = { ...defaultBinPool }
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 10n, 10n)

    const { amountIn, fee: fee1, amountOutLeft } = getSwapIn(bin, BigInt(1e18), true)
    expect(amountIn).toBe(1007534624899920784n) // 1e18 + 0.3% fee
    expect(amountOutLeft).toBe(0n)
    expect(fee1).toBe(3022603874699769n)
    expect(amountIn - fee1).toBeGreaterThan(BigInt(1e18))

    const { amountOut, fee: fee2, amountInLeft } = getSwapOut(bin, amountIn, true)
    expect(amountInLeft).toBe(0n)
    expect(amountOut).toBe(BigInt(1e18))
    expect(fee2).toBe(fee1)

    const { result } = swap(bin, amountIn, true)
    expect(result[0]).toBe(amountIn)
    expect(result[1]).toBe(-BigInt(1e18))
  })

  test('failed::insufficient amount in', () => {
    const bin = { ...defaultBinPool }
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const amountIn = 0n

    expect(() => swap(bin, amountIn, true)).toThrow('INSUFFICIENT_AMOUNT_IN')
    expect(() => swap(bin, amountIn, false)).toThrow('INSUFFICIENT_AMOUNT_IN')
  })

  test('failed::insufficient amount out', () => {
    const bin = { ...defaultBinPool }
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const amountIn = 1n

    expect(() => swap(bin, amountIn, true)).toThrow('INSUFFICIENT_AMOUNT_OUT')
    expect(() => swap(bin, amountIn, false)).toThrow('INSUFFICIENT_AMOUNT_OUT')
  })

  test('failed::out of liquidity', () => {
    const bin = { ...defaultBinPool }
    setLiquidity(bin, bin.activeId, BigInt(1e18), BigInt(1e18), 50n, 50n)

    const amountIn = BigInt(2e18)

    expect(() => swap(bin, amountIn, true)).toThrow('OUT_OF_LIQUIDITY')
    expect(() => swap(bin, amountIn, false)).toThrow('OUT_OF_LIQUIDITY')
  })

  describe('swapFee', () => {
    const createBinPoolWithFee = (_lpFee: bigint, _protocolFees: [bigint, bigint]) => {
      const bin = { ...defaultBinPool, lpFee: _lpFee, protocolFees: _protocolFees } as BinPoolState
      setLiquidity(bin, bin.activeId, BigInt(10_000e18), BigInt(10_000e18), 50n, 50n)
      return bin
    }
    const cases: Array<[string, BinPoolState]> = [
      ['protocol fee = 0; lpFee = 0', createBinPoolWithFee(0n, [0n, 0n])],
      ['protocol fee = 0; lpFee = 0.3%', createBinPoolWithFee(3000n, [0n, 0n])],
      ['protocol fee = 0.1%; lpFee = 0', createBinPoolWithFee(0n, [1000n, 1000n])],
      ['protocol fee = 0.1%; lpFee = 0.3%', createBinPoolWithFee(3000n, [1000n, 1000n])],
    ]

    cases.forEach(([name, bin]) => {
      test(`SwapForY ${name}`, () => {
        const amountIn = BigInt(1e18)
        const swapForY = true

        const { amountOut } = getSwapOut(bin, amountIn, swapForY)
        const { amountIn: amountIn2 } = getSwapIn(bin, amountOut, swapForY)

        const { result } = swap(bin, amountIn, swapForY)
        expect(result[0]).toBe(amountIn)
        expect(result[0]).toBe(amountIn2)
        expect(result[1]).toBe(-amountOut)
      })
    })
    cases.forEach(([name, bin]) => {
      test(`SwapForX ${name}`, () => {
        const amountIn = BigInt(1e18)
        const swapForY = false

        const { amountOut } = getSwapOut(bin, amountIn, swapForY)
        const { amountIn: amountIn2 } = getSwapIn(bin, amountOut, swapForY)

        const { result } = swap(bin, amountIn, swapForY)
        expect(result[0]).toBe(-amountOut)
        expect(result[1]).toBe(amountIn)
        expect(result[1]).toBe(amountIn2)
      })
    })
  })
})
