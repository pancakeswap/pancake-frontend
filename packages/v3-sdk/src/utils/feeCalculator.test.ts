import { BigintIsh, ZERO, JSBI } from '@pancakeswap/swap-sdk-core'

import { getLiquidityFromTick, getAverageLiquidity } from './feeCalculator'
import { Tick } from '../entities'

const createTick = (index: number, liquidityGross: BigintIsh, liquidityNet: BigintIsh) =>
  new Tick({ index, liquidityGross, liquidityNet })

describe('#getLiquidityFromTick', () => {
  const ticks = [
    createTick(1, 10, 10),
    createTick(20, 5, 5),
    createTick(50, 20, 20),
    createTick(80, 5, -5),
    createTick(100, 10, -10),
    createTick(150, 20, -20),
  ]

  it('No liquidity when tick is out of initialized tick range', () => {
    expect(JSBI.equal(getLiquidityFromTick(ticks, 0), ZERO)).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 151), ZERO)).toBe(true)
  })

  it('Get liquidity at single tick', () => {
    expect(JSBI.equal(getLiquidityFromTick(ticks, 1), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 20), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 50), JSBI.BigInt(15))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 80), JSBI.BigInt(35))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 100), JSBI.BigInt(30))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 150), JSBI.BigInt(20))).toBe(true)
  })

  it('Use lower tick liquidity if tick is between initialized ticks', () => {
    expect(JSBI.equal(getLiquidityFromTick(ticks, 10), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 30), JSBI.BigInt(15))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 70), JSBI.BigInt(35))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 90), JSBI.BigInt(30))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 120), JSBI.BigInt(20))).toBe(true)
  })
})

describe('#getAverageLiquidity', () => {
  const ticks = [
    createTick(0, 10, 10),
    createTick(10, 5, 5),
    createTick(20, 20, 20),
    createTick(30, 5, -5),
    createTick(40, 10, -10),
    createTick(50, 20, -20),
  ]

  it('Tick lower and upper cover initialied tick range', () => {
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 0, 50), JSBI.BigInt(22))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, -10, 100), JSBI.BigInt(10))).toBe(true)
  })

  it('Liquidity at tick', () => {
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, -1, -1), ZERO)).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 51, 51), ZERO)).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 0, 0), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 10, 10), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 20, 20), JSBI.BigInt(15))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 30, 30), JSBI.BigInt(35))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 40, 40), JSBI.BigInt(30))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 50, 50), JSBI.BigInt(20))).toBe(true)
  })

  it('Tick lower and upper are both initialized ticks', () => {
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 0, 10), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 10, 20), JSBI.BigInt(15))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 0, 20), JSBI.BigInt(12))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 10, 40), JSBI.BigInt(26))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 30, 50), JSBI.BigInt(25))).toBe(true)
  })

  it('Tick boundaries within adjacent initialied ticks', () => {
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 5, 15), JSBI.BigInt(12))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 15, 35), JSBI.BigInt(28))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, -5, 20), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getAverageLiquidity(ticks, 1, 38, 53), JSBI.BigInt(17))).toBe(true)
  })
})
