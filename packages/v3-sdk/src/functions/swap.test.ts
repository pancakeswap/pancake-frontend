import { CurrencyAmount, Ether, Token } from '@pancakeswap/sdk'
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
const NativeToken = Ether.onChain(1)

describe('swaps', () => {
  let erc20Pool: PoolState
  let nativePool: PoolState

  beforeEach(() => {
    const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
    erc20Pool = {
      currency0: USDC,
      currency1: DAI,
      fee: FeeAmount.LOW,
      sqrtRatioX96,
      liquidity: ONE_ETHER,
      tickSpacing: TICK_SPACINGS[FeeAmount.LOW],
      tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96),
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

    nativePool = {
      currency0: NativeToken,
      currency1: DAI,
      fee: FeeAmount.LOW,
      sqrtRatioX96,
      liquidity: ONE_ETHER,
      tickCurrent: TickMath.getTickAtSqrtRatio(sqrtRatioX96),
      tickSpacing: TICK_SPACINGS[FeeAmount.LOW],
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
    test('not involved currency', () => {
      const inputAmount = CurrencyAmount.fromRawAmount(NativeToken, 100)
      expect(async () => getOutputAmount(erc20Pool, inputAmount)).rejects.toThrowError('Invariant failed: CURRENCY')
    })

    test('USDC -> DAI', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(USDC, 100)
      const [outputAmount] = await getOutputAmount(erc20Pool, inputAmount)
      expect(outputAmount.currency.equals(DAI)).toBe(true)
      expect(outputAmount.quotient).toEqual(98n)
    })

    test('exact', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(USDC, ONE_ETHER * ONE_ETHER * 100n)
      expect(() => getOutputAmount(erc20Pool, inputAmount, { exact: true })).rejects.toThrowError(
        'Invariant failed: INSUFFICIENT_LIQUIDITY'
      )
    })

    test('NativeToken -> DAI', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(NativeToken, 100)
      const [outputAmount] = await getOutputAmount(nativePool, inputAmount)
      expect(outputAmount.currency.equals(DAI)).toBe(true)
      expect(outputAmount.quotient).toEqual(98n)
    })

    test('DAI -> USDC', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(DAI, 100)
      const [outputAmount] = await getOutputAmount(erc20Pool, inputAmount)
      expect(outputAmount.currency.equals(USDC)).toBe(true)
      expect(outputAmount.quotient).toEqual(98n)
    })

    test('DAI -> NativeToken', async () => {
      const inputAmount = CurrencyAmount.fromRawAmount(DAI, 100)
      const [outputAmount] = await getOutputAmount(nativePool, inputAmount)
      expect(outputAmount.currency.equals(NativeToken)).toBe(true)
      expect(outputAmount.quotient).toEqual(98n)
    })
  })
  describe('#getInputAmount', () => {
    test('not involved currency', () => {
      const outputAmount = CurrencyAmount.fromRawAmount(NativeToken, 100)
      expect(async () => getInputAmount(erc20Pool, outputAmount)).rejects.toThrowError('Invariant failed: CURRENCY')
    })

    test('exact', async () => {
      const outputAmount = CurrencyAmount.fromRawAmount(USDC, ONE_ETHER * ONE_ETHER * 100n)
      expect(() => getInputAmount(erc20Pool, outputAmount, { exact: true })).rejects.toThrowError(
        'Invariant failed: INSUFFICIENT_LIQUIDITY'
      )
    })

    test('USDC -> DAI', async () => {
      const outputAmount = CurrencyAmount.fromRawAmount(DAI, 98)
      const [inputAmount] = await getInputAmount(erc20Pool, outputAmount)
      expect(inputAmount.currency.equals(USDC)).toBe(true)
      expect(inputAmount.quotient).toEqual(100n)
    })

    test('DAI -> USDC', async () => {
      const outputAmount = CurrencyAmount.fromRawAmount(USDC, 98)
      const [inputAmount] = await getInputAmount(erc20Pool, outputAmount)
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
      currency0: USDC,
      currency1: DAI,
      fee: FeeAmount.LOW,
      sqrtRatioX96: encodeSqrtRatioX96(bigNum1, bigNum2),
      liquidity: ONE_ETHER,
      tickSpacing: TICK_SPACINGS[FeeAmount.LOW],
      tickCurrent: TickMath.getTickAtSqrtRatio(encodeSqrtRatioX96(bigNum1, bigNum2)),
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
