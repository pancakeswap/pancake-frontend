import { ChainId } from '@pancakeswap/chains'
import { BigintIsh, CurrencyAmount, Fraction, Percent, Token, ZERO } from '@pancakeswap/swap-sdk-core'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Tick } from '../entities'
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96'
import { FeeCalculator } from './feeCalculator'

const {
  getLiquidityFromTick,
  getAverageLiquidity,
  getLiquidityBySingleAmount,
  getDependentAmount,
  getLiquidityFromSqrtRatioX96,
} = FeeCalculator

const busd = new Token(
  ChainId.BSC,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/'
)

const usdt = new Token(
  ChainId.BSC,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
  'https://tether.to/'
)

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
    expect(getLiquidityFromTick(ticks, 0) === ZERO).toBe(true)
    expect(getLiquidityFromTick(ticks, 151) === ZERO).toBe(true)
  })

  it('Get liquidity at single tick', () => {
    expect(getLiquidityFromTick(ticks, 1) === 10n).toBe(true)
    expect(getLiquidityFromTick(ticks, 20) === 10n).toBe(true)
    expect(getLiquidityFromTick(ticks, 50) === 15n).toBe(true)
    expect(getLiquidityFromTick(ticks, 80) === 35n).toBe(true)
    expect(getLiquidityFromTick(ticks, 100) === 30n).toBe(true)
    expect(getLiquidityFromTick(ticks, 150) === 20n).toBe(true)
  })

  it('Use lower tick liquidity if tick is between initialized ticks', () => {
    expect(getLiquidityFromTick(ticks, 10) === 10n).toBe(true)
    expect(getLiquidityFromTick(ticks, 30) === 15n).toBe(true)
    expect(getLiquidityFromTick(ticks, 70) === 35n).toBe(true)
    expect(getLiquidityFromTick(ticks, 90) === 30n).toBe(true)
    expect(getLiquidityFromTick(ticks, 120) === 20n).toBe(true)
  })

  it('#getLiquidityFromSqrtRatioX96', () => {
    expect(getLiquidityFromSqrtRatioX96(ticks, 79307426338960776842885539845n)).toEqual(10n)
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
    expect(getAverageLiquidity(ticks, 1, 0, 50) === 22n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, -10, 100) === 10n).toBe(true)
  })

  it('Liquidity at tick', () => {
    expect(getAverageLiquidity(ticks, 1, -1, -1) === ZERO).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 51, 51) === ZERO).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 0, 0) === 10n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 10, 10) === 10n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 20, 20) === 15n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 30, 30) === 35n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 40, 40) === 30n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 50, 50) === 20n).toBe(true)
  })

  it('Tick lower and upper are both initialized ticks', () => {
    expect(getAverageLiquidity(ticks, 1, 0, 10) === 10n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 10, 20) === 15n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 0, 20) === 12n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 10, 40) === 26n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 30, 50) === 25n).toBe(true)
  })

  it('Tick boundaries within adjacent initialied ticks', () => {
    expect(getAverageLiquidity(ticks, 1, 5, 15) === 12n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 15, 35) === 28n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, -5, 20) === 10n).toBe(true)
    expect(getAverageLiquidity(ticks, 1, 38, 53) === 17n).toBe(true)
  })
})

describe('#getLiquidityBySingleAmount', () => {
  it('input with token 0 amount', () => {
    const amount = getLiquidityBySingleAmount({
      amount: CurrencyAmount.fromRawAmount(usdt, '100'),
      currency: busd,
      tickLower: -953,
      tickUpper: 953,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount).toEqual(2149n)
  })

  it('input with token 1 amount', () => {
    const amount = getLiquidityBySingleAmount({
      amount: CurrencyAmount.fromRawAmount(busd, '200'),
      currency: usdt,
      tickLower: -953,
      tickUpper: 953,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount).toEqual(4298n)
  })
})

describe('#getDependentAmount', () => {
  it('input with token 0 amount', () => {
    const amount = getDependentAmount({
      amount: CurrencyAmount.fromRawAmount(usdt, '100'),
      currency: busd,
      tickLower: -1000,
      tickUpper: 1000,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount!.quotient).toEqual(99n)
    expect(amount!.currency).toEqual(busd)
  })

  it('input with token 1 amount', () => {
    const amount = getDependentAmount({
      amount: CurrencyAmount.fromRawAmount(busd, '100'),
      currency: usdt,
      tickLower: -1000,
      tickUpper: 1000,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    })
    expect(amount!.quotient).toEqual(99n)
    expect(amount!.currency).toEqual(usdt)
  })
})

describe('#getEstimatedLPFee', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('100% in range', () => {
    const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
    const mostActiveLiquidity = 900n

    const getLiquidityByAmountsAndPriceSpy = vi
      .spyOn(FeeCalculator, 'getLiquidityByAmountsAndPrice')
      .mockImplementationOnce(() => 100n)
    const getLiquidityFromSqrtRatioX96Spy = vi
      .spyOn(FeeCalculator, 'getLiquidityFromSqrtRatioX96')
      .mockImplementationOnce(() => 900n)
    const amount = FeeCalculator.getEstimatedLPFee({
      amount: CurrencyAmount.fromRawAmount(usdt, '100'),
      currency: busd,
      tickLower: 0,
      tickUpper: 10,
      sqrtRatioX96,
      volume24H: 10000,
      mostActiveLiquidity,
      fee: 500,
    })
    expect(getLiquidityByAmountsAndPriceSpy).toHaveBeenCalledTimes(1)
    expect(getLiquidityFromSqrtRatioX96Spy).toHaveBeenCalledTimes(0)
    expect(amount.equalTo(new Fraction(5, 10))).toBe(true)
  })

  it('50% in range', () => {
    const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
    const mostActiveLiquidity = 900n

    const getLiquidityByAmountsAndPriceSpy = vi
      .spyOn(FeeCalculator, 'getLiquidityByAmountsAndPrice')
      .mockImplementationOnce(() => 100n)
    const getLiquidityFromSqrtRatioX96Spy = vi
      .spyOn(FeeCalculator, 'getLiquidityFromSqrtRatioX96')
      .mockImplementationOnce(() => 900n)
    const amount = FeeCalculator.getEstimatedLPFee({
      amount: CurrencyAmount.fromRawAmount(usdt, '100'),
      currency: busd,
      tickLower: 0,
      tickUpper: 10,
      sqrtRatioX96,
      volume24H: 10000,
      mostActiveLiquidity,
      fee: 500,
      insidePercentage: new Percent(50, 100),
    })
    expect(getLiquidityByAmountsAndPriceSpy).toHaveBeenCalledTimes(1)
    expect(getLiquidityFromSqrtRatioX96Spy).toHaveBeenCalledTimes(0)
    expect(amount.equalTo(new Fraction(5, 20))).toBe(true)
  })
})
