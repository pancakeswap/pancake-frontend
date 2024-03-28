import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { beforeEach, describe, expect, test } from 'vitest'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { TickListDataProvider } from '../entities'
import { NEGATIVE_ONE } from '../internalConstants'
import { TickMath, encodeSqrtRatioX96, nearestUsableTick } from '../utils'
import { PoolState } from './getPool'
import { getInputAmount, getOutputAmount } from './swap'

const ONE_ETHER = 10n ** 18n
const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

describe('swaps', () => {
  let pool: PoolState

  beforeEach(() => {
    pool = {
      token0: USDC,
      token1: DAI,
      fee: FeeAmount.LOW,
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
      liquidity: ONE_ETHER,
      tick: 0,
      tickDataProvider: new TickListDataProvider([
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[FeeAmount.LOW]),
          liquidityNet: ONE_ETHER,
          liquidityGross: ONE_ETHER,
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[FeeAmount.LOW]),
          liquidityNet: ONE_ETHER * NEGATIVE_ONE,
          liquidityGross: ONE_ETHER,
        },
      ]),
    }
  })

  describe('#getOutputAmount', () => {
    test('USDC -> DAI', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(USDC, 100)
      const [outputAmount] = await getOutputAmount(pool, inputAmount)
      expect(outputAmount.currency.equals(DAI)).toBe(true)
      expect(outputAmount.quotient).toEqual(98n)
    })

    test('DAI -> USDC', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(DAI, 100)
      const [outputAmount] = await getOutputAmount(pool, inputAmount)
      expect(outputAmount.currency.equals(USDC)).toBe(true)
      expect(outputAmount.quotient).toEqual(98n)
    })
  })
  describe('#getInputAmount', () => {
    test('USDC -> DAI', async () => {
      const outputAmount = CurrencyAmount.fromRawAmount(DAI, 98)
      const [inputAmount] = await getInputAmount(pool, outputAmount)
      expect(inputAmount.currency.equals(USDC)).toBe(true)
      expect(inputAmount.quotient).toEqual(100n)
    })

    test('DAI -> USDC', async () => {
      const outputAmount = CurrencyAmount.fromRawAmount(USDC, 98)
      const [inputAmount] = await getInputAmount(pool, outputAmount)
      expect(inputAmount.currency.equals(DAI)).toBe(true)
      expect(inputAmount.quotient).toEqual(100n)
    })
  })
})

describe('#bigNums', () => {
  let pool: PoolState
  const bigNum1 = BigInt(Number.MAX_SAFE_INTEGER) + 1n
  const bigNum2 = BigInt(Number.MAX_SAFE_INTEGER) + 1n
  beforeEach(() => {
    pool = {
      token0: USDC,
      token1: DAI,
      fee: FeeAmount.LOW,
      sqrtRatioX96: encodeSqrtRatioX96(bigNum1, bigNum2),
      liquidity: ONE_ETHER,
      tick: 0,
      tickDataProvider: new TickListDataProvider([
        {
          index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[FeeAmount.LOW]),
          liquidityNet: ONE_ETHER,
          liquidityGross: ONE_ETHER,
        },
        {
          index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[FeeAmount.LOW]),
          liquidityNet: ONE_ETHER * NEGATIVE_ONE,
          liquidityGross: ONE_ETHER,
        },
      ]),
    }
  })

  describe('#priceLimit', () => {
    test('correctly compares two BigIntegers', async () => {
      expect(bigNum1).toEqual(bigNum2)
    })
    test('correctly handles two BigIntegers', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(USDC, 100)
      const [outputAmount] = await getOutputAmount(pool, inputAmount)
      getInputAmount(pool, outputAmount)
      expect(outputAmount.currency.equals(DAI)).toBe(true)
      // if output is correct, function has succeeded
    })
  })
})
