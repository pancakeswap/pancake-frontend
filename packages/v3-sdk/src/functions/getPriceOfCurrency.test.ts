import { Ether, Token } from '@pancakeswap/sdk'
import { describe, expect, test } from 'vitest'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { encodeSqrtRatioX96 } from '../utils'
import { getPool } from './getPool'
import { getPriceOfCurrency, getPriceOfCurrency0, getPriceOfCurrency1 } from './getPriceOfCurrency'

describe('getPriceOfCurrency', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  const pool0 = getPool({
    currencyA: DAI,
    currencyB: USDC,
    fee: FeeAmount.MEDIUM,
    tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
    sqrtRatioX96: encodeSqrtRatioX96(101e6, 100e18),
    liquidity: 0,
    tickCurrent: 0,
  })

  const pool1 = getPool({
    currencyA: Ether.onChain(1),
    currencyB: USDC,
    fee: FeeAmount.MEDIUM,
    tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
    sqrtRatioX96: encodeSqrtRatioX96(100e18, 101e6),
    liquidity: 0,
    tickCurrent: 0,
  })

  test('getCurrency0 price', () => {
    expect(getPriceOfCurrency(pool0, DAI).toSignificant(5)).toEqual('1.01')
    expect(getPriceOfCurrency(pool0, DAI)).toEqual(getPriceOfCurrency0(pool0))

    expect(getPriceOfCurrency(pool1, Ether.onChain(1)).toSignificant(5)).toEqual('990100000000000000000000')
    expect(getPriceOfCurrency0(pool1)).toEqual(getPriceOfCurrency(pool1, Ether.onChain(1)))
  })

  test('getCurrency1 price', () => {
    expect(getPriceOfCurrency(pool0, USDC).toSignificant(5)).toEqual('0.00000000000000000000000101')
    expect(getPriceOfCurrency(pool0, USDC)).toEqual(getPriceOfCurrency1(pool0))

    expect(getPriceOfCurrency1(pool1).toSignificant(5)).toEqual('0.9901')
    expect(getPriceOfCurrency(pool1, USDC)).toEqual(getPriceOfCurrency1(pool1))
  })
})
