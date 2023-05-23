import { CurrencyAmount, Token, TradeType, WETH9 } from '@pancakeswap/sdk'
import { describe, expect, it } from 'vitest'
import { FeeAmount, TICK_SPACINGS } from './constants'
import { SwapQuoter } from './quoter'
import { nearestUsableTick, encodeSqrtRatioX96, TickMath } from './utils'
import { Route, Trade, Pool } from './entities'

describe('SwapQuoter', () => {
  const token0 = new Token(1, '0x0000000000000000000000000000000000000001', 18, 't0', 'token0')
  const token1 = new Token(1, '0x0000000000000000000000000000000000000002', 18, 't1', 'token1')

  const feeAmount = FeeAmount.MEDIUM
  const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
  const liquidity = 1_000_000
  const WETH = WETH9[1]

  const makePool = (token0: Token, token1: Token) => {
    return new Pool(token0, token1, feeAmount, sqrtRatioX96, liquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96), [
      {
        index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
        liquidityNet: liquidity,
        liquidityGross: liquidity,
      },
      {
        index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
        liquidityNet: -liquidity,
        liquidityGross: liquidity,
      },
    ])
  }

  const pool_0_1 = makePool(token0, token1)
  const pool_1_weth = makePool(token1, WETH)

  describe('#swapCallParameters', () => {
    describe('single trade input', () => {
      it('single-hop exact input', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.inputAmount,
          trade.tradeType
        )

        expect(calldata).toBe(
          '0xf7729d430000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })

      it('single-hop exact output', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token1, 100),
          TradeType.EXACT_OUTPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.outputAmount,
          trade.tradeType
        )

        expect(calldata).toBe(
          '0x30d07f210000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })

      it('multi-hop exact input', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_weth], token0, WETH),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(trade.route, trade.inputAmount, trade.tradeType)

        expect(calldata).toBe(
          '0xcdca175300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })

      it('multi-hop exact output', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1, pool_1_weth], token0, WETH),
          CurrencyAmount.fromRawAmount(WETH, 100),
          TradeType.EXACT_OUTPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(trade.route, trade.outputAmount, trade.tradeType)

        expect(calldata).toBe(
          '0x2f80bb1d000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000042c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20009c400000000000000000000000000000000000000020009c40000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
      it('sqrtPriceLimitX96', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(trade.route, trade.inputAmount, trade.tradeType, {
          sqrtPriceLimitX96: 2n ** 128n,
        })

        expect(calldata).toBe(
          '0xf7729d430000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000100000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
    })
    describe('single trade input using Quoter V2', () => {
      it('single-hop exact output', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token1, 100),
          TradeType.EXACT_OUTPUT
        )

        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.outputAmount,
          trade.tradeType,
          {
            useQuoterV2: true,
          }
        )

        expect(calldata).toBe(
          '0xbd21704a00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
      it('single-hop exact input', async () => {
        const trade = await Trade.fromRoute(
          new Route([pool_0_1], token0, token1),
          CurrencyAmount.fromRawAmount(token0, 100),
          TradeType.EXACT_INPUT
        )
        const { calldata, value } = SwapQuoter.quoteCallParameters(
          trade.swaps[0].route,
          trade.inputAmount,
          trade.tradeType,
          { useQuoterV2: true }
        )

        expect(calldata).toBe(
          '0xc6a5026a00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000000'
        )
        expect(value).toBe('0x00')
      })
    })
  })
})
