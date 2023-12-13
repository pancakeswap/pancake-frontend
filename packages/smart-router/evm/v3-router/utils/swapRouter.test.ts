/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import {
  BigintIsh,
  Currency,
  CurrencyAmount,
  Native,
  Pair,
  Percent,
  Token,
  TradeType,
  Route as V2Route,
  Trade as V2Trade,
  WNATIVE,
} from '@pancakeswap/sdk'
import {
  FeeAmount,
  Position,
  TICK_SPACINGS,
  TickMath,
  Pool as V3PoolSDK,
  Route as V3Route,
  Trade as V3Trade,
  encodeSqrtRatioX96,
  nearestUsableTick,
} from '@pancakeswap/v3-sdk'
import { describe, expect, it } from 'vitest'
import { Pool, PoolType, RouteType, SmartRouterTrade, V2Pool, V3Pool } from '../types'
import { ApprovalTypes } from './approveAndCall'
import { isV2Pool, isV3Pool } from './pool'
import { SwapRouter } from './swapRouter'

describe('SwapRouter', () => {
  const ETHER = Native.onChain(1)
  const WETH = WNATIVE[1]

  const token0 = new Token(1, '0x0000000000000000000000000000000000000001', 18, 't0', 'token0')
  const token1 = new Token(1, '0x0000000000000000000000000000000000000002', 18, 't1', 'token1')
  const token2 = new Token(1, '0x0000000000000000000000000000000000000003', 18, 't2', 'token2')

  const feeAmount = FeeAmount.MEDIUM
  const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
  const liquidity = 1_000_000

  // v3
  const makeV3Pool = (token0: Token, token1: Token, liquidityNum: number): V3Pool => {
    const liquidity = BigInt(liquidityNum)
    return {
      type: PoolType.V3,
      token0,
      token1,
      fee: feeAmount,
      liquidity,
      sqrtRatioX96,
      tick: TickMath.getTickAtSqrtRatio(sqrtRatioX96),
      address: V3PoolSDK.getAddress(token0, token1, feeAmount),
      token0ProtocolFee: new Percent(0, 100),
      token1ProtocolFee: new Percent(0, 100),
      ticks: [
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
      ],
    }
  }

  const convertV3PoolToSDKPool = ({ token0, token1, fee, sqrtRatioX96, liquidity, tick, ticks }: V3Pool) =>
    new V3PoolSDK(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick, ticks)
  const convertV2PoolToSDKPool = ({ reserve1, reserve0 }: V2Pool) => new Pair(reserve0.wrapped, reserve1.wrapped)

  const makeV3Trade = async (
    pools: V3Pool[],
    tokenIn: Currency,
    tokenOut: Currency,
    amount: CurrencyAmount<Currency>,
    tradeType: TradeType,
  ): Promise<SmartRouterTrade<TradeType>> => {
    const v3Pools = pools.map(convertV3PoolToSDKPool)
    const v3Trade = await V3Trade.fromRoute(new V3Route(v3Pools, tokenIn, tokenOut), amount, tradeType)
    return {
      tradeType,
      inputAmount: v3Trade.inputAmount,
      outputAmount: v3Trade.outputAmount,
      routes: [
        {
          type: RouteType.V3,
          pools,
          path: v3Trade.swaps[0].route.tokenPath,
          percent: 100,
          inputAmount: v3Trade.inputAmount,
          outputAmount: v3Trade.outputAmount,
        },
      ],
      gasEstimate: 0n,
      gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0),
      blockNumber: 0,
    }
  }

  // v2
  const makeV2Pool = (token0: Token, token1: Token, liquidity: BigintIsh): V2Pool => {
    const reserve0 = CurrencyAmount.fromRawAmount(token0, BigInt(liquidity))
    const reserve1 = CurrencyAmount.fromRawAmount(token1, BigInt(liquidity))

    return {
      type: PoolType.V2,
      reserve0,
      reserve1,
    }
  }

  const makeV2Trade = (
    pools: V2Pool[],
    tokenIn: Currency,
    tokenOut: Currency,
    amount: CurrencyAmount<Currency>,
    tradeType: TradeType,
  ): SmartRouterTrade<TradeType> => {
    const v2Pools = pools.map(convertV2PoolToSDKPool)
    const getTrade = tradeType === TradeType.EXACT_INPUT ? V2Trade.exactIn : V2Trade.exactOut
    const v2Trade = getTrade(new V2Route(v2Pools, tokenIn, tokenOut), amount)
    return {
      tradeType,
      inputAmount: v2Trade.inputAmount,
      outputAmount: v2Trade.outputAmount,
      routes: [
        {
          type: RouteType.V2,
          pools,
          path: v2Trade.route.path,
          percent: 100,
          inputAmount: v2Trade.inputAmount,
          outputAmount: v2Trade.outputAmount,
        },
      ],
      gasEstimate: 0n,
      gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0),
      blockNumber: 0,
    }
  }

  const makeMixedRouteTrade = async (
    pools: Pool[],
    tokenIn: Currency,
    tokenOut: Currency,
    amount: CurrencyAmount<Currency>,
    tradeType: TradeType,
  ): Promise<SmartRouterTrade<TradeType>> => {
    const sdkPools: (Pair | V3PoolSDK)[] = pools.map((pool) => {
      if (isV3Pool(pool)) {
        return convertV3PoolToSDKPool(pool)
      }
      if (isV2Pool(pool)) {
        return convertV2PoolToSDKPool(pool)
      }
      throw new Error('Unrecognized pool')
    })

    const amounts: CurrencyAmount<Token>[] = new Array(sdkPools.length + 1)

    const path: Currency[] = [amount.currency.wrapped]
    amounts[0] = amount.wrapped
    for (let i = 0; i < sdkPools.length; i++) {
      const pool = sdkPools[i]
      const [outputAmount] = await pool.getOutputAmount(amounts[i])
      path.push(outputAmount.currency)
      amounts[i + 1] = outputAmount
    }
    const inputAmount = CurrencyAmount.fromFractionalAmount(tokenIn, amount.numerator, amount.denominator)
    const outputAmount = CurrencyAmount.fromFractionalAmount(
      tokenOut,
      amounts[amounts.length - 1].numerator,
      amounts[amounts.length - 1].denominator,
    )
    return {
      tradeType,
      inputAmount,
      outputAmount,
      routes: [
        {
          type: RouteType.MIXED,
          pools,
          path,
          percent: 100,
          inputAmount,
          outputAmount,
        },
      ],
      gasEstimate: 0n,
      gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0),
      blockNumber: 0,
    }
  }

  const pool_0_1 = makeV3Pool(token0, token1, liquidity)
  const pair_0_1 = makeV2Pool(token0, token1, liquidity)
  const pair_1_2 = makeV2Pool(token1, token2, liquidity)

  const pool_1_WETH = makeV3Pool(token1, WETH, liquidity)
  const pair_1_WETH = makeV2Pool(token1, WETH, liquidity)
  const pair_2_WETH = makeV2Pool(token2, WETH, liquidity)
  const pool_2_WETH = makeV3Pool(token2, WETH, liquidity)

  const slippageTolerance = new Percent(1, 100)
  const recipient = '0x0000000000000000000000000000000000000003'
  const deadline = 123

  describe('#swapCallParameters', () => {
    describe('single-hop exact input (v2 + v3)', () => {
      describe('different trade configurations result in identical calldata', () => {
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e4472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000061000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)

        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

        it('array of trades', async () => {
          const trades = [v2Trade, await v3Trade]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(value).toBe('0x00')
        })

        // it('meta-trade', async () => {
        //   const trades = await Trade.fromRoutes(
        //     [
        //       {
        //         routev2: v2Trade.route,
        //         amount: amountIn,
        //       },
        //     ],
        //     [
        //       {
        //         routev3: (await v3Trade).swaps[0].route,
        //         amount: amountIn,
        //       },
        //     ],
        //     TradeType.EXACT_INPUT,
        //   )

        //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
        //     slippageTolerance,
        //     recipient,
        //     deadlineOrPreviousBlockhash: deadline,
        //   })
        //   expect(calldata).toEqual(expectedCalldata)
        //   expect(value).toBe('0x00')
        // })
      })
    })

    describe('single-hop exact output (v2 + v3)', () => {
      describe('different trade configurations result in identical calldata', () => {
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e442712a6700000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000066000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e45023b4df0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000067000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountOut = CurrencyAmount.fromRawAmount(token1, 100n)

        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountOut, TradeType.EXACT_OUTPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountOut, TradeType.EXACT_OUTPUT)

        it('array of trades', async () => {
          const trades = [v2Trade, await v3Trade]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(value).toBe('0x00')
        })

        // it('meta-trade', async () => {
        //   const trades = await Trade.fromRoutes(
        //     [
        //       {
        //         routev2: v2Trade.route,
        //         amount: amountOut,
        //       },
        //     ],
        //     [
        //       {
        //         routev3: (await v3Trade).swaps[0].route,
        //         amount: amountOut,
        //       },
        //     ],
        //     TradeType.EXACT_OUTPUT,
        //   )

        //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
        //     slippageTolerance,
        //     recipient,
        //     deadlineOrPreviousBlockhash: deadline,
        //   })
        //   expect(calldata).toEqual(expectedCalldata)
        //   expect(value).toBe('0x00')
        // })
      })
    })

    describe('multi-hop exact input (v2 + v3)', () => {
      describe('different trade configurations result in identical calldata', () => {
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000104472b43f30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)

        const v2Trade = makeV2Trade([pair_0_1, pair_1_WETH], token0, WETH, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1, pool_1_WETH], token0, WETH, amountIn, TradeType.EXACT_INPUT)

        it('array of trades', async () => {
          const trades = [v2Trade, await v3Trade]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(value).toBe('0x00')
        })

        // it('meta-trade', async () => {
        //   const trades = await Trade.fromRoutes(
        //     [
        //       {
        //         routev2: v2Trade.route,
        //         amount: amountIn,
        //       },
        //     ],
        //     [
        //       {
        //         routev3: (await v3Trade).swaps[0].route,
        //         amount: amountIn,
        //       },
        //     ],
        //     TradeType.EXACT_INPUT,
        //   )

        //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
        //     slippageTolerance,
        //     recipient,
        //     deadlineOrPreviousBlockhash: deadline,
        //   })
        //   expect(calldata).toEqual(expectedCalldata)
        //   expect(value).toBe('0x00')
        // })
      })
    })

    describe('multi-hop exact output (v2 + v3)', () => {
      describe('different trade configurations result in identical calldata', () => {
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000010442712a670000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006700000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012409b81346000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000690000000000000000000000000000000000000000000000000000000000000042c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20009c400000000000000000000000000000000000000020009c4000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountOut = CurrencyAmount.fromRawAmount(WETH, 100n)

        const v2Trade = makeV2Trade([pair_0_1, pair_1_WETH], token0, WETH, amountOut, TradeType.EXACT_OUTPUT)
        const v3Trade = makeV3Trade([pool_0_1, pool_1_WETH], token0, WETH, amountOut, TradeType.EXACT_OUTPUT)

        it('array of trades', async () => {
          const trades = [v2Trade, await v3Trade]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(value).toBe('0x00')
        })

        // it('meta-trade', async () => {
        //   const trades = await Trade.fromRoutes(
        //     [
        //       {
        //         routev2: v2Trade.route,
        //         amount: amountOut,
        //       },
        //     ],
        //     [
        //       {
        //         routev3: (await v3Trade).swaps[0].route,
        //         amount: amountOut,
        //       },
        //     ],
        //     TradeType.EXACT_OUTPUT,
        //   )

        //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
        //     slippageTolerance,
        //     recipient,
        //     deadlineOrPreviousBlockhash: deadline,
        //   })
        //   expect(calldata).toEqual(expectedCalldata)
        //   expect(value).toBe('0x00')
        // })
      })
    })

    describe('Mixed Route', () => {
      describe('single-hop exact input (v2 + v3) backwards compatible', () => {
        describe('different trade configurations result in identical calldata', async () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e4472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000061000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)

          const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
          const v3Trade = await makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

          const mixedRouteTrade1 = {
            ...v2Trade,
            routes: v2Trade.routes.map((r) => ({ ...r, type: RouteType.MIXED })),
          }
          const mixedRouteTrade2 = {
            ...v3Trade,
            routes: v3Trade.routes.map((r) => ({ ...r, type: RouteType.MIXED })),
          }

          it('generates the same calldata', async () => {
            const trades = [mixedRouteTrade1, mixedRouteTrade2]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')

            const mixedRouteTrades = [mixedRouteTrade1, mixedRouteTrade2]
            const { calldata: mixedRouteCalldata, value: mixedRouteValue } = SwapRouter.swapCallParameters(
              mixedRouteTrades,
              {
                slippageTolerance,
                recipient,
                deadlineOrPreviousBlockhash: deadline,
              },
            )
            expect(mixedRouteCalldata).toEqual(expectedCalldata)
            expect(mixedRouteValue).toBe('0x00')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')

          //   const mixedRouteTrades = await Trade.fromRoutes([], [], TradeType.EXACT_INPUT, [
          //     {
          //       mixedRoute: (await mixedRouteTrade1).swaps[0].route,
          //       amount: amountIn,
          //     },
          //     {
          //       mixedRoute: (await mixedRouteTrade2).swaps[0].route,
          //       amount: amountIn,
          //     },
          //   ])

          //   const { calldata: mixedRouteCalldata, value: mixedRouteValue } = SwapRouter.swapCallParameters(
          //     mixedRouteTrades,
          //     {
          //       slippageTolerance,
          //       recipient,
          //       deadlineOrPreviousBlockhash: deadline,
          //     },
          //   )
          //   expect(mixedRouteCalldata).toEqual(expectedCalldata)
          //   expect(mixedRouteValue).toBe('0x00')
          // })
        })
      })

      describe('multi-hop exact input (mixed route) backwards compatible', () => {
        describe('different trade configurations result in identical calldata', async () => {
          /// calldata verified and taken from existing test
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000104472b43f30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)

          const v2Trade = makeV2Trade([pair_0_1, pair_1_WETH], token0, WETH, amountIn, TradeType.EXACT_INPUT)
          const v3Trade = await makeV3Trade([pool_0_1, pool_1_WETH], token0, WETH, amountIn, TradeType.EXACT_INPUT)

          const mixedRouteTrade1 = {
            ...v2Trade,
            routes: v2Trade.routes.map((r) => ({ ...r, type: RouteType.MIXED })),
          }
          const mixedRouteTrade2 = {
            ...v3Trade,
            routes: v3Trade.routes.map((r) => ({ ...r, type: RouteType.MIXED })),
          }

          it('single mixedRoute trade', () => {
            const trades = [mixedRouteTrade1, mixedRouteTrade2]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes([], [], TradeType.EXACT_INPUT, [
          //     {
          //       mixedRoute: (await mixedRouteTrade1).swaps[0].route,
          //       amount: amountIn,
          //     },
          //     {
          //       mixedRoute: (await mixedRouteTrade2).swaps[0].route,
          //       amount: amountIn,
          //     },
          //   ])

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })
        })
      })

      describe('mixed route trades with routes with consecutive pools/pairs', () => {
        /// manually verified calldata
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001e0000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004400000000000000000000000000000000000000000000000000000000000000124b858183f00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e4472b43f30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005e000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005f000000000000000000000000000000000000000000000000000000000000002b00000000000000000000000000000000000000030009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)
        const mixedRouteTrade1 = makeMixedRouteTrade(
          [pool_0_1, pool_1_WETH, pair_2_WETH],
          token0,
          WETH,
          amountIn,
          TradeType.EXACT_INPUT,
        )
        const mixedRouteTrade2 = makeMixedRouteTrade(
          [pair_0_1, pair_1_2, pool_2_WETH],
          token0,
          WETH,
          amountIn,
          TradeType.EXACT_INPUT,
        )

        it('generates correct calldata', async () => {
          const trades = [await mixedRouteTrade1, await mixedRouteTrade2]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(value).toBe('0x00')
        })
      })
    })

    describe('ETH input', () => {
      describe('single-hop exact input (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e4472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000061000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          const amountIn = CurrencyAmount.fromRawAmount(ETHER, 100n)

          const v2Trade = makeV2Trade([pair_1_WETH], ETHER, token1, amountIn, TradeType.EXACT_INPUT)
          const v3Trade = makeV3Trade([pool_1_WETH], ETHER, token1, amountIn, TradeType.EXACT_INPUT)

          /// mixedRouteTrade mirrors the V3Trade
          const mixedRouteTrade = makeMixedRouteTrade([pool_1_WETH], ETHER, token1, amountIn, TradeType.EXACT_INPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0xc8')
          })

          it('mixedRoute produces the same calldata when swapped in', async () => {
            const trades = [v2Trade, await mixedRouteTrade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0xc8')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0xc8')
          // })

          // it('meta-trade with mixedRoute', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [],
          //     TradeType.EXACT_INPUT,
          //     [
          //       {
          //         mixedRoute: (await mixedRouteTrade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0xc8')
          // })
        })
      })

      describe('single-hop exact output (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000e442712a6700000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000066000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e45023b4df000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000067000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000412210e8a00000000000000000000000000000000000000000000000000000000'
          const amountOut = CurrencyAmount.fromRawAmount(token1, 100n)

          const v2Trade = makeV2Trade([pair_1_WETH], ETHER, token1, amountOut, TradeType.EXACT_OUTPUT)
          const v3Trade = makeV3Trade([pool_1_WETH], ETHER, token1, amountOut, TradeType.EXACT_OUTPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0xcd')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountOut,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountOut,
          //       },
          //     ],
          //     TradeType.EXACT_OUTPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0xcd')
          // })
        })
      })

      describe('multi-hop exact input (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000104472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000061000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f0000000000000000000000000000000000000000000000000000000000000042c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20009c400000000000000000000000000000000000000020009c4000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
          const amountIn = CurrencyAmount.fromRawAmount(ETHER, 100n)

          const v2Trade = makeV2Trade([pair_1_WETH, pair_0_1], ETHER, token0, amountIn, TradeType.EXACT_INPUT)
          /// mixedRouteTrade mirrors V2Trade
          const mixedRouteTrade = makeMixedRouteTrade(
            [pair_1_WETH, pair_0_1],
            ETHER,
            token0,
            amountIn,
            TradeType.EXACT_INPUT,
          )
          const v3Trade = makeV3Trade([pool_1_WETH, pool_0_1], ETHER, token0, amountIn, TradeType.EXACT_INPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0xc8')
          })

          it('mixedRoutes in array produce same calldata', async () => {
            const trades = [await mixedRouteTrade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0xc8')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0xc8')
          // })

          // it('meta-trade with mixedRoutes produces calldata in different order but same content', async () => {
          //   /// @dev since we order the calldata in the array in a particular way (v2, v3, mixedRoute) the ordering will be different, but the encoded swap data will be the same
          //   /// Additionally, since we aren't sharing balances across trades order should not matter
          //   const expectedCalldata =
          //     '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f0000000000000000000000000000000000000000000000000000000000000042c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20009c400000000000000000000000000000000000000020009c40000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000061000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000'
          //   const trades = await Trade.fromRoutes(
          //     [],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //     [
          //       {
          //         mixedRoute: (await mixedRouteTrade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0xc8')
          // })
        })
      })

      describe('multi-hop exact output (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010442712a6700000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000067000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012409b8134600000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000069000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000412210e8a00000000000000000000000000000000000000000000000000000000'
          const amountOut = CurrencyAmount.fromRawAmount(token0, 100n)

          const v2Trade = makeV2Trade([pair_1_WETH, pair_0_1], ETHER, token0, amountOut, TradeType.EXACT_OUTPUT)
          const v3Trade = makeV3Trade([pool_1_WETH, pool_0_1], ETHER, token0, amountOut, TradeType.EXACT_OUTPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0xd0')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountOut,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountOut,
          //       },
          //     ],
          //     TradeType.EXACT_OUTPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0xd0')
          // })
        })
      })

      describe('high price impact with ETH input to result in refundETH being appended to calldata', () => {
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000e4472b43f300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000062000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000412210e8a00000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(ETHER, 100n)
        const pool_1_WETH_slippage = makeV3Pool(token1, WETH, 100)
        const REFUND_ETH_FUNCTION_SIG = /12210e8a/

        const v2Trade = makeV2Trade([pair_1_WETH], ETHER, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_1_WETH_slippage], ETHER, token1, amountIn, TradeType.EXACT_INPUT)

        it('array of trades', async () => {
          const trades = [v2Trade, await v3Trade]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(calldata).toMatch(REFUND_ETH_FUNCTION_SIG)
          expect(value).toBe('0xc8')
        })
      })

      describe('high price impact with ERCO20 input does not result in refundETH call', () => {
        const expectedCalldata =
          '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token1, 100n)
        const pool_1_WETH_slippage = makeV3Pool(token1, WETH, 100)
        const REFUND_ETH_FUNCTION_SIG = /12210e8a/

        const v2Trade = makeV2Trade([pair_1_WETH], token1, WETH, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_1_WETH_slippage], token1, WETH, amountIn, TradeType.EXACT_INPUT)

        it('array of trades', async () => {
          const trades = [v2Trade, await v3Trade]
          const { calldata, value } = SwapRouter.swapCallParameters(trades, {
            slippageTolerance,
            recipient,
            deadlineOrPreviousBlockhash: deadline,
          })
          expect(calldata).toEqual(expectedCalldata)
          expect(calldata).not.toMatch(REFUND_ETH_FUNCTION_SIG)
          expect(value).toBe('0x00')
        })
      })
    })

    describe('ETH output', () => {
      describe('single-hop exact input (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000620000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000061000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000000000000000c3000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000'
          const amountIn = CurrencyAmount.fromRawAmount(token1, 100n)

          const v2Trade = makeV2Trade([pair_1_WETH], token1, ETHER, amountIn, TradeType.EXACT_INPUT)
          const v3Trade = makeV3Trade([pool_1_WETH], token1, ETHER, amountIn, TradeType.EXACT_INPUT)

          /// mixedRoute mirrors v3Trade
          const mixedRouteTrade = makeMixedRouteTrade([pool_1_WETH], token1, ETHER, amountIn, TradeType.EXACT_INPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          it('array of trades with mixedRoute produces same calldata', async () => {
            const trades = [v2Trade, await mixedRouteTrade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })

          // it('meta-trade with mixedRoute produces same calldata', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [],
          //     TradeType.EXACT_INPUT,
          //     [
          //       {
          //         mixedRoute: (await mixedRouteTrade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })
        })
      })

      describe('single-hop exact output (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000e442712a67000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000660000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e45023b4df0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000067000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000'
          const amountOut = CurrencyAmount.fromRawAmount(ETHER, 100n)

          const v2Trade = makeV2Trade([pair_1_WETH], token1, ETHER, amountOut, TradeType.EXACT_OUTPUT)
          const v3Trade = makeV3Trade([pool_1_WETH], token1, ETHER, amountOut, TradeType.EXACT_OUTPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountOut,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountOut,
          //       },
          //     ],
          //     TradeType.EXACT_OUTPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })
        })
      })

      describe('multi-hop exact input (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000104472b43f30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000'
          const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)

          const v2Trade = makeV2Trade([pair_0_1, pair_1_WETH], token0, ETHER, amountIn, TradeType.EXACT_INPUT)
          /// mixedRouteTrade mirrors v2Trade
          const mixedRouteTrade = makeMixedRouteTrade(
            [pair_0_1, pair_1_WETH],
            token0,
            ETHER,
            amountIn,
            TradeType.EXACT_INPUT,
          )
          const v3Trade = makeV3Trade([pool_0_1, pool_1_WETH], token0, ETHER, amountIn, TradeType.EXACT_INPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          it('array of trades with mixedRoute produces same calldata', async () => {
            const trades = [await mixedRouteTrade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountIn,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })

          // it('meta-trade with mixedRoute produces same calldata but in different order', async () => {
          //   const expectedCalldata =
          //     '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000104472b43f30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000'
          //   const trades = await Trade.fromRoutes(
          //     [],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //     TradeType.EXACT_INPUT,
          //     [
          //       {
          //         mixedRoute: (await mixedRouteTrade).swaps[0].route,
          //         amount: amountIn,
          //       },
          //     ],
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })
        })
      })

      describe('multi-hop exact output (v2 + v3)', () => {
        describe('different trade configurations result in identical calldata', () => {
          const expectedCalldata =
            '0x5ae401dc000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010442712a670000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006700000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012409b81346000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000690000000000000000000000000000000000000000000000000000000000000042c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20009c400000000000000000000000000000000000000020009c4000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004449404b7c00000000000000000000000000000000000000000000000000000000000000c8000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000'
          const amountOut = CurrencyAmount.fromRawAmount(ETHER, 100n)

          const v2Trade = makeV2Trade([pair_0_1, pair_1_WETH], token0, ETHER, amountOut, TradeType.EXACT_OUTPUT)
          const v3Trade = makeV3Trade([pool_0_1, pool_1_WETH], token0, ETHER, amountOut, TradeType.EXACT_OUTPUT)

          it('array of trades', async () => {
            const trades = [v2Trade, await v3Trade]
            const { calldata, value } = SwapRouter.swapCallParameters(trades, {
              slippageTolerance,
              recipient,
              deadlineOrPreviousBlockhash: deadline,
            })
            expect(calldata).toEqual(expectedCalldata)
            expect(value).toBe('0x00')
          })

          // it('meta-trade', async () => {
          //   const trades = await Trade.fromRoutes(
          //     [
          //       {
          //         routev2: v2Trade.route,
          //         amount: amountOut,
          //       },
          //     ],
          //     [
          //       {
          //         routev3: (await v3Trade).swaps[0].route,
          //         amount: amountOut,
          //       },
          //     ],
          //     TradeType.EXACT_OUTPUT,
          //   )

          //   const { calldata, value } = SwapRouter.swapCallParameters(trades, {
          //     slippageTolerance,
          //     recipient,
          //     deadlineOrPreviousBlockhash: deadline,
          //   })
          //   expect(calldata).toEqual(expectedCalldata)
          //   expect(value).toBe('0x00')
          // })
        })
      })
    })

    describe('#swapAndAddCallParameters', () => {
      describe('single-hop trades', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003a00000000000000000000000000000000000000000000000000000000000000420000000000000000000000000000000000000000000000000000000000000056000000000000000000000000000000000000000000000000000000000000005e000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a5489000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010411ed56c90000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c4ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffce0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 10n)

        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        /// mirrors V2Trade
        const mixedRouteTrade2 = makeMixedRouteTrade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        /// mixedRoute mirrors v3Trade
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_1),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          recipient: '0x0000000000000000000000000000000000000006',
          slippageTolerance,
          deadline: 2 ** 32,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process when v2 + mixedRoute', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process when mixedRoute + v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('multi-hop trades', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000003800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000005c000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000104472b43f30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000006100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000124b858183f0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000005f000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000010009c400000000000000000000000000000000000000020009c4c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000002a53d8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010411ed56c90000000000000000000000000000000000000000000000000000000000000001000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000009c4ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffce0000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

        const pool_0_WETH = makeV3Pool(token0, WETH, liquidity)
        const amountIn = CurrencyAmount.fromRawAmount(token0, 100n)
        const v2Trade = makeV2Trade([pair_0_1, pair_1_WETH], token0, WETH, amountIn, TradeType.EXACT_INPUT)
        /// mirrors V2Trade
        const mixedRouteTrade2 = makeMixedRouteTrade(
          [pair_0_1, pair_1_WETH],
          token0,
          WETH,
          amountIn,
          TradeType.EXACT_INPUT,
        )
        const v3Trade = makeV3Trade([pool_0_1, pool_1_WETH], token0, WETH, amountIn, TradeType.EXACT_INPUT)
        /// mixedRoute mirrors v3Trade
        const mixedRouteTrade3 = makeMixedRouteTrade(
          [pool_0_1, pool_1_WETH],
          token0,
          WETH,
          amountIn,
          TradeType.EXACT_INPUT,
        )

        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_WETH),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          recipient: '0x0000000000000000000000000000000000000006',
          slippageTolerance,
          deadline: 2 ** 32,
        }

        it('encodes the entire swap process for a multi route trade', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('encodes the entire swap process for a multi route trade with v2, mixedRoute', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('encodes the entire swap process for a multi route trade with mixedRoute, v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('encodes the entire swap process for a multi route trade with mixedRoute, mixedRoute', async () => {
          const trades = [await mixedRouteTrade2, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('adding liquidity to an existing position', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000032000000000000000000000000000000000000000000000000000000000000003a000000000000000000000000000000000000000000000000000000000000004200000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000058000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a5489000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b20500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 10n)
        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade2 = makeMixedRouteTrade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_1),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, v2, mixed', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, mixed, v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.NOT_REQUIRED,
            ApprovalTypes.NOT_REQUIRED,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('when MAX tokens must be approved to the NFT Manager', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000900000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000068000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a5489000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024571ac8b00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024571ac8b000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b20500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 10n)
        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade2 = makeMixedRouteTrade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_1),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, v2, mixed', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, mixed, v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, mixed, mixed', async () => {
          const trades = [await mixedRouteTrade2, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('when MAX_MINUS_ONE tokens must be approved to the NFT Manager', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000900000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000068000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a5489000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024cab372ce0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024cab372ce00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b20500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 10n)
        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade2 = makeMixedRouteTrade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_1),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX_MINUS_ONE,
            ApprovalTypes.MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, v2, mixed', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX_MINUS_ONE,
            ApprovalTypes.MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, mixed, v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX_MINUS_ONE,
            ApprovalTypes.MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process, mixed, mixed', async () => {
          const trades = [await mixedRouteTrade2, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX_MINUS_ONE,
            ApprovalTypes.MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('when ZERO_THEN_MAX tokens must be approved to the NFT Manager', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000900000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000068000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a5489000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024639d71a90000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024639d71a900000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b20500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 10n)
        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade2 = makeMixedRouteTrade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_1),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX,
            ApprovalTypes.ZERO_THEN_MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process v2, mixed', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX,
            ApprovalTypes.ZERO_THEN_MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process mixed, v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX,
            ApprovalTypes.ZERO_THEN_MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process mixed, mixed', async () => {
          const trades = [await mixedRouteTrade2, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX,
            ApprovalTypes.ZERO_THEN_MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('when ZERO_THEN_MAX_MINUS_ONE tokens must be approved to the NFT Manager', () => {
        const expectedCalldata =
          '0xac9650d80000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000900000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004c000000000000000000000000000000000000000000000000000000000000005200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000068000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a5489000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000002a549a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024ab3fdd500000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024ab3fdd5000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b20500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const amountIn = CurrencyAmount.fromRawAmount(token0, 10n)

        const v2Trade = makeV2Trade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade2 = makeMixedRouteTrade([pair_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const v3Trade = makeV3Trade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_0_1], token0, token1, amountIn, TradeType.EXACT_INPUT)

        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_0_1),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [v2Trade, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process v2, mixed', async () => {
          const trades = [v2Trade, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process mixed, v3', async () => {
          const trades = [await mixedRouteTrade2, await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process mixed, mixed', async () => {
          const trades = [await mixedRouteTrade2, await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
            ApprovalTypes.ZERO_THEN_MAX_MINUS_ONE,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('when input is native', () => {
        const expectedCalldata =
          '0xac9650d8000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002a00000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a54920000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000241c58db4f00000000000000000000000000000000000000000000000000000000002a549a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024571ac8b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024571ac8b000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b2050000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024496169970000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

        const ETH = Native.onChain(1)
        const amountIn = CurrencyAmount.fromRawAmount(ETH, 10n)
        const v3Trade = makeV3Trade([pool_1_WETH], ETH, token1, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_1_WETH], ETH, token1, amountIn, TradeType.EXACT_INPUT)
        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_1_WETH),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process when is a mixedRoute', async () => {
          const trades = [await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })

      describe('when output is native', () => {
        const expectedCalldata =
          '0xac9650d8000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000000000000052000000000000000000000000000000000000000000000000000000000000000e404e45aaf0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000241c58db4f00000000000000000000000000000000000000000000000000000000002a5492000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044f2d5d56b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000002a549a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024571ac8b00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024571ac8b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a4f100b2050000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044e90a182f0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002449616997000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        const ETH = Native.onChain(1)
        const amountIn = CurrencyAmount.fromRawAmount(token1, 10n)
        const v3Trade = makeV3Trade([pool_1_WETH], token1, ETH, amountIn, TradeType.EXACT_INPUT)
        const mixedRouteTrade3 = makeMixedRouteTrade([pool_1_WETH], token1, ETH, amountIn, TradeType.EXACT_INPUT)
        const position = new Position({
          pool: convertV3PoolToSDKPool(pool_1_WETH),
          tickLower: -50,
          tickUpper: 50,
          liquidity: 1111111111,
        })
        const addLiquidityOptions = {
          slippageTolerance,
          deadline: 2 ** 32,
          tokenId: 1,
        }

        it('correctly encodes the entire swap process', async () => {
          const trades = [await v3Trade]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })

        it('correctly encodes the entire swap process when is mixedRoute', async () => {
          const trades = [await mixedRouteTrade3]
          const methodParameters = SwapRouter.swapAndAddCallParameters(
            trades,
            { slippageTolerance },
            position,
            addLiquidityOptions,
            ApprovalTypes.MAX,
            ApprovalTypes.MAX,
          )
          expect(methodParameters.calldata).toEqual(expectedCalldata)
        })
      })
    })
  })
})
