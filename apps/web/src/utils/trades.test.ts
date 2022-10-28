import { Trade, Route, Token, ChainId, Pair, JSBI, TradeType, CurrencyAmount } from '@pancakeswap/sdk'
import { BETTER_TRADE_LESS_HOPS_THRESHOLD } from 'config/constants/exchange'
import { isTradeBetter } from './trades'

describe('isTradeBetter', () => {
  const token1 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000001', 18)
  const token2 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000002', 18)
  const token3 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000003', 18)

  const pair12 = new Pair(
    CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(20000)),
    CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(20000)),
  )
  const pair23 = new Pair(
    CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(20000)),
    CurrencyAmount.fromRawAmount(token3, JSBI.BigInt(30000)),
  )
  const pair13 = new Pair(
    CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(30000)),
    CurrencyAmount.fromRawAmount(token3, JSBI.BigInt(30000)),
  )

  it('should return false if tradeB missing', () => {
    expect(
      isTradeBetter(
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
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
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
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
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
          TradeType.EXACT_INPUT,
        ),
        new Trade(
          new Route([pair12], token2, token1),
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
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
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
          TradeType.EXACT_INPUT,
        ),
        new Trade(
          new Route([pair23], token2, token3),
          CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(1000)),
          TradeType.EXACT_INPUT,
        ),
      ),
    ).toThrowError('Trades are not comparable')

    expect(() =>
      isTradeBetter(
        new Trade(
          new Route([pair12], token1, token2),
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
          TradeType.EXACT_INPUT,
        ),
        new Trade(
          new Route([pair13], token1, token3),
          CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
          TradeType.EXACT_INPUT,
        ),
      ),
    ).toThrowError('Trades are not comparable')
  })

  it('should tradeB is better when minimumDelta is Zero', () => {
    const tradeA = new Trade(
      new Route([pair13], token1, token3),
      CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(9000)),
      TradeType.EXACT_INPUT,
    )
    const tradeB = new Trade(
      new Route([pair12, pair23], token1, token3),
      CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(9000)),
      TradeType.EXACT_INPUT,
    )

    expect(isTradeBetter(tradeA, tradeB)).toBeTruthy()
  })
  it('should tradeB is better when minimumDelta is not Zero', () => {
    const tradeA = new Trade(
      new Route([pair13], token1, token3),
      CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(9000)),
      TradeType.EXACT_INPUT,
    )
    const tradeB = new Trade(
      new Route([pair12, pair23], token1, token3),
      CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(9000)),
      TradeType.EXACT_INPUT,
    )

    expect(isTradeBetter(tradeA, tradeB, BETTER_TRADE_LESS_HOPS_THRESHOLD)).toBeTruthy()
  })
})
