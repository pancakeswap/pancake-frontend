import { ChainId, JSBI, Pair, Route, Token, Trade, TradeType, CurrencyAmount } from '@pancakeswap/sdk'
import { computeTradePriceBreakdown } from 'utils/exchange'

describe('prices', () => {
  const token1 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000001', 18)
  const token2 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000002', 18)
  const token3 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000003', 18)

  const pair12 = new Pair(
    CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(10000)),
    CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(20000)),
  )
  const pair23 = new Pair(
    CurrencyAmount.fromRawAmount(token2, JSBI.BigInt(20000)),
    CurrencyAmount.fromRawAmount(token3, JSBI.BigInt(30000)),
  )

  describe('computeTradePriceBreakdown', () => {
    it('returns undefined for undefined', () => {
      expect(computeTradePriceBreakdown(undefined)).toEqual({
        priceImpactWithoutFee: undefined,
        realizedLPFee: undefined,
      })
    })

    it('correct realized lp fee for single hop', () => {
      expect(
        computeTradePriceBreakdown(
          new Trade(
            new Route([pair12], token1, token2),
            CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
            TradeType.EXACT_INPUT,
          ),
        ).realizedLPFee,
      ).toEqual(CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(2)))
    })

    it('correct realized lp fee for double hop', () => {
      expect(
        computeTradePriceBreakdown(
          new Trade(
            new Route([pair12, pair23], token1, token3),
            CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(1000)),
            TradeType.EXACT_INPUT,
          ),
        ).realizedLPFee,
      ).toEqual(CurrencyAmount.fromRawAmount(token1, JSBI.BigInt(4)))
    })
  })
})
