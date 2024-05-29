import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount, Percent, Token, TradeType } from '@pancakeswap/swap-sdk-core'
import { describe, expect, it } from 'vitest'

import { Pair, Route, Trade } from '../src/entities'
import { isTradeBetter } from '../src/trade'

const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, 10000n)

describe('isTradeBetter', () => {
  const token1 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000001', 18, '1')
  const token2 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000002', 18, '2')
  const token3 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000003', 18, '3')

  const pair12 = new Pair(CurrencyAmount.fromRawAmount(token1, 20000n), CurrencyAmount.fromRawAmount(token2, 20000n))
  const pair23 = new Pair(CurrencyAmount.fromRawAmount(token2, 20000n), CurrencyAmount.fromRawAmount(token3, 30000n))
  const pair13 = new Pair(CurrencyAmount.fromRawAmount(token1, 30000n), CurrencyAmount.fromRawAmount(token3, 30000n))

  it('should return false if tradeB missing', () => {
    expect(
      isTradeBetter(
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_INPUT,
        ),
        undefined,
      ),
    ).toBeFalsy()
  })

  it('should return true if tradeA missing', () => {
    expect(
      isTradeBetter(
        undefined,
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_INPUT,
        ),
      ),
    ).toBeTruthy()
  })

  it('should return undefined if both trade missing', () => {
    expect(isTradeBetter(undefined, undefined)).toBeUndefined()
  })

  it('should throw error if tradeType is not the same', () => {
    expect(() =>
      isTradeBetter(
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_INPUT,
        ),
        new Trade(
          new Route([pair12], token2, token1),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_OUTPUT,
        ),
      ),
    ).toThrow('Trades are not comparable')
  })

  it('should throw error if Input/Output is not the same', () => {
    expect(() =>
      isTradeBetter(
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_INPUT,
        ),
        new Trade(
          new Route([pair23], token2, token3),
          CurrencyAmount.fromRawAmount(token2, 1000n),
          TradeType.EXACT_INPUT,
        ),
      ),
    ).toThrowError('Trades are not comparable')

    expect(() =>
      isTradeBetter(
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_INPUT,
        ),
        new Trade(
          new Route([pair13], token1, token3),
          CurrencyAmount.fromRawAmount(token1, 1000n),
          TradeType.EXACT_INPUT,
        ),
      ),
    ).toThrowError('Trades are not comparable')
  })

  it('should tradeB is better when minimumDelta is Zero', () => {
    const tradeA = new Trade(
      new Route([pair13], token1, token3),
      CurrencyAmount.fromRawAmount(token1, 9000n),
      TradeType.EXACT_INPUT,
    )
    const tradeB = new Trade(
      new Route([pair12, pair23], token1, token3),
      CurrencyAmount.fromRawAmount(token1, 9000n),
      TradeType.EXACT_INPUT,
    )

    expect(isTradeBetter(tradeA, tradeB)).toBeTruthy()
  })
  it('should tradeB is better when minimumDelta is not Zero', () => {
    const tradeA = new Trade(
      new Route([pair13], token1, token3),
      CurrencyAmount.fromRawAmount(token1, 9000n),
      TradeType.EXACT_INPUT,
    )
    const tradeB = new Trade(
      new Route([pair12, pair23], token1, token3),
      CurrencyAmount.fromRawAmount(token1, 9000n),
      TradeType.EXACT_INPUT,
    )

    expect(isTradeBetter(tradeA, tradeB, BETTER_TRADE_LESS_HOPS_THRESHOLD)).toBeTruthy()
  })
})
