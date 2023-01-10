import { BigintIsh, ZERO, JSBI } from '@pancakeswap/swap-sdk-core'

import { getLiquidityFromTick } from './feeCalculator'
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
    expect(JSBI.equal(getLiquidityFromTick(ticks, 20), JSBI.BigInt(15))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 50), JSBI.BigInt(35))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 80), JSBI.BigInt(30))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 100), JSBI.BigInt(20))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 150), ZERO)).toBe(true)
  })

  it('Use lower tick liquidity if tick is between initialized ticks', () => {
    expect(JSBI.equal(getLiquidityFromTick(ticks, 10), JSBI.BigInt(10))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 30), JSBI.BigInt(15))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 70), JSBI.BigInt(35))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 90), JSBI.BigInt(30))).toBe(true)
    expect(JSBI.equal(getLiquidityFromTick(ticks, 120), JSBI.BigInt(20))).toBe(true)
  })
})
