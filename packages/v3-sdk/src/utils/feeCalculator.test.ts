import { BigintIsh, ZERO, JSBI, CurrencyAmount, Fraction, Percent } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'
import { vi } from 'vitest'

import { FeeCalculator } from './feeCalculator'
import { Tick } from '../entities'
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96'

const {
  getLiquidityFromTick,
  getAverageLiquidity,
  getLiquidityBySingleAmount,
  getDependentAmount,
  getLiquidityFromSqrtRatioX96,
} = FeeCalculator

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

  it('#getLiquidityFromSqrtRatioX96', () => {
    expect(getLiquidityFromSqrtRatioX96(ticks, JSBI.BigInt('79307426338960776842885539845'))).toEqual(JSBI.BigInt(10))
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

describe('#getLiquidityBySingleAmount', () => {
  it('input with token 0 amount', () => {
    const amount = getLiquidityBySingleAmount({
      amount: CurrencyAmount.fromRawAmount(bscTokens.usdt, '100'),
      currency: bscTokens.busd,
      tickLower: -953,
      tickUpper: 953,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount).toEqual(JSBI.BigInt(2149))
  })

  it('input with token 1 amount', () => {
    const amount = getLiquidityBySingleAmount({
      amount: CurrencyAmount.fromRawAmount(bscTokens.busd, '200'),
      currency: bscTokens.usdt,
      tickLower: -953,
      tickUpper: 953,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount).toEqual(JSBI.BigInt(4298))
  })
})

describe('#getDependentAmount', () => {
  it('input with token 0 amount', () => {
    const amount = getDependentAmount({
      amount: CurrencyAmount.fromRawAmount(bscTokens.usdt, '100'),
      currency: bscTokens.busd,
      tickLower: -1000,
      tickUpper: 1000,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount.quotient).toEqual(JSBI.BigInt(99))
    expect(amount.currency).toEqual(bscTokens.busd)
  })

  it('input with token 1 amount', () => {
    const amount = getDependentAmount({
      amount: CurrencyAmount.fromRawAmount(bscTokens.busd, '100'),
      currency: bscTokens.usdt,
      tickLower: -1000,
      tickUpper: 1000,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount.quotient).toEqual(JSBI.BigInt(99))
    expect(amount.currency).toEqual(bscTokens.usdt)
  })
})

describe('#getEstimatedLPFee', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('100% in range', () => {
    const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
    const mostActiveLiquidity = JSBI.BigInt(900)

    const getLiquidityBySingleAmountSpy = vi
      .spyOn(FeeCalculator, 'getLiquidityBySingleAmount')
      .mockImplementationOnce(() => JSBI.BigInt(100))
    const getLiquidityFromSqrtRatioX96Spy = vi
      .spyOn(FeeCalculator, 'getLiquidityFromSqrtRatioX96')
      .mockImplementationOnce(() => JSBI.BigInt(900))
    const amount = FeeCalculator.getEstimatedLPFee({
      amount: CurrencyAmount.fromRawAmount(bscTokens.usdt, '100'),
      currency: bscTokens.busd,
      tickLower: 0,
      tickUpper: 10,
      sqrtRatioX96,
      volume24H: 10000,
      mostActiveLiquidity,
      fee: 500,
    })
    expect(getLiquidityBySingleAmountSpy).toHaveBeenCalledTimes(1)
    expect(getLiquidityFromSqrtRatioX96Spy).toHaveBeenCalledTimes(0)
    expect(amount.equalTo(new Fraction(5, 10))).toBe(true)
  })

  it('50% in range', () => {
    const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
    const mostActiveLiquidity = JSBI.BigInt(900)

    const getLiquidityBySingleAmountSpy = vi
      .spyOn(FeeCalculator, 'getLiquidityBySingleAmount')
      .mockImplementationOnce(() => JSBI.BigInt(100))
    const getLiquidityFromSqrtRatioX96Spy = vi
      .spyOn(FeeCalculator, 'getLiquidityFromSqrtRatioX96')
      .mockImplementationOnce(() => JSBI.BigInt(900))
    const amount = FeeCalculator.getEstimatedLPFee({
      amount: CurrencyAmount.fromRawAmount(bscTokens.usdt, '100'),
      currency: bscTokens.busd,
      tickLower: 0,
      tickUpper: 10,
      sqrtRatioX96,
      volume24H: 10000,
      mostActiveLiquidity,
      fee: 500,
      insidePercentage: new Percent(50, 100),
    })
    expect(getLiquidityBySingleAmountSpy).toHaveBeenCalledTimes(1)
    expect(getLiquidityFromSqrtRatioX96Spy).toHaveBeenCalledTimes(0)
    expect(amount.equalTo(new Fraction(5, 20))).toBe(true)
  })
})
