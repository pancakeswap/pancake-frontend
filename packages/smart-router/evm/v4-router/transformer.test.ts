import { CurrencyAmount, Native, Percent, TradeType } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { opBnbTokens } from '@pancakeswap/tokens'
import { describe, expect, it } from 'vitest'

import { serializeRoute, serializeTrade } from './transformer'
import { PoolType, RouteType } from '../v3-router/types'
import { V4Route, V4Trade } from './types'
import { createGraph } from './graph'

const BNB = Native.onChain(ChainId.OPBNB)
const CAKE = opBnbTokens.cake

const exampleRoute: V4Route = {
  gasUseEstimate: 82000n,
  gasUseEstimateBase: CurrencyAmount.fromRawAmount(BNB, 820000n),
  gasUseEstimateQuote: CurrencyAmount.fromRawAmount(CAKE, 103854983n),
  inputAmount: CurrencyAmount.fromRawAmount(BNB, 40000000000000000n),
  outputAmount: CurrencyAmount.fromRawAmount(CAKE, 4983293793789930646n),
  inputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(BNB, 40000000000000000n),
  outputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(CAKE, 4983293793686075663n),
  path: [BNB.wrapped, CAKE],
  percent: 100,
  pools: [
    {
      address: '0xC71C9b3d94916630309d67651Ae00A69c47BdF8a',
      fee: 500,
      liquidity: 16884816146554984600n,
      reserve0: CurrencyAmount.fromRawAmount(CAKE, 34339042604161103151n),
      reserve1: CurrencyAmount.fromRawAmount(BNB.wrapped, 96404341221305485n),
      sqrtRatioX96: 7003297243708108638293279371n,
      tick: -48522,
      ticks: [
        {
          index: -49930,
          liquidityGross: 14858697659497433931n,
          liquidityNet: 14858697659497433931n,
        },
      ],
      token0: CAKE,
      token1: BNB.wrapped,
      token0ProtocolFee: new Percent(34, 100),
      token1ProtocolFee: new Percent(34, 100),
      type: PoolType.V3,
    },
  ],
  type: RouteType.V3,
}

const exampleTrade: V4Trade<TradeType> = {
  graph: createGraph({ pools: [] }),
  routes: [exampleRoute],
  gasUseEstimate: 82000n,
  gasUseEstimateBase: CurrencyAmount.fromRawAmount(BNB, 820000n),
  gasUseEstimateQuote: CurrencyAmount.fromRawAmount(CAKE, 103854983n),
  inputAmount: CurrencyAmount.fromRawAmount(BNB, 40000000000000000n),
  outputAmount: CurrencyAmount.fromRawAmount(CAKE, 4983293793789930646n),
  inputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(BNB, 40000000000000000n),
  outputAmountWithGasAdjusted: CurrencyAmount.fromRawAmount(CAKE, 4983293793686075663n),
  tradeType: TradeType.EXACT_INPUT,
}

describe('V4 Router Transformer', () => {
  it('Serialize route', () => {
    expect(serializeRoute(exampleRoute)).toEqual({
      type: 1,
      path: [
        {
          address: '0x4200000000000000000000000000000000000006',
          decimals: 18,
          symbol: 'WBNB',
        },
        {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
      ],
      pools: [
        {
          type: 1,
          token0: {
            address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
            decimals: 18,
            symbol: 'CAKE',
          },
          token1: {
            address: '0x4200000000000000000000000000000000000006',
            decimals: 18,
            symbol: 'WBNB',
          },
          fee: 500,
          liquidity: '16884816146554984600',
          sqrtRatioX96: '7003297243708108638293279371',
          tick: -48522,
          address: '0xC71C9b3d94916630309d67651Ae00A69c47BdF8a',
          token0ProtocolFee: '34',
          token1ProtocolFee: '34',
          reserve0: {
            currency: {
              address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
              decimals: 18,
              symbol: 'CAKE',
            },
            value: '34339042604161103151',
          },
          reserve1: {
            currency: {
              address: '0x4200000000000000000000000000000000000006',
              decimals: 18,
              symbol: 'WBNB',
            },
            value: '96404341221305485',
          },
          ticks: [
            {
              index: -49930,
              liquidityNet: '14858697659497433931',
              liquidityGross: '14858697659497433931',
            },
          ],
        },
      ],
      gasUseEstimate: '82000',
      inputAmount: {
        currency: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'BNB',
        },
        value: '40000000000000000',
      },
      outputAmount: {
        currency: {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
        value: '4983293793789930646',
      },
      inputAmountWithGasAdjusted: {
        currency: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'BNB',
        },
        value: '40000000000000000',
      },
      outputAmountWithGasAdjusted: {
        currency: {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
        value: '4983293793686075663',
      },
      gasUseEstimateQuote: {
        currency: {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
        value: '103854983',
      },
      gasUseEstimateBase: {
        currency: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'BNB',
        },
        value: '820000',
      },
      percent: 100,
    })
  })

  it('Serialize trade', () => {
    expect(serializeTrade(exampleTrade)).toEqual({
      routes: [
        {
          type: 1,
          path: [
            {
              address: '0x4200000000000000000000000000000000000006',
              decimals: 18,
              symbol: 'WBNB',
            },
            {
              address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
              decimals: 18,
              symbol: 'CAKE',
            },
          ],
          pools: [
            {
              type: 1,
              token0: {
                address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
                decimals: 18,
                symbol: 'CAKE',
              },
              token1: {
                address: '0x4200000000000000000000000000000000000006',
                decimals: 18,
                symbol: 'WBNB',
              },
              fee: 500,
              liquidity: '16884816146554984600',
              sqrtRatioX96: '7003297243708108638293279371',
              tick: -48522,
              address: '0xC71C9b3d94916630309d67651Ae00A69c47BdF8a',
              token0ProtocolFee: '34',
              token1ProtocolFee: '34',
              reserve0: {
                currency: {
                  address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
                  decimals: 18,
                  symbol: 'CAKE',
                },
                value: '34339042604161103151',
              },
              reserve1: {
                currency: {
                  address: '0x4200000000000000000000000000000000000006',
                  decimals: 18,
                  symbol: 'WBNB',
                },
                value: '96404341221305485',
              },
              ticks: [
                {
                  index: -49930,
                  liquidityNet: '14858697659497433931',
                  liquidityGross: '14858697659497433931',
                },
              ],
            },
          ],
          gasUseEstimate: '82000',
          inputAmount: {
            currency: {
              address: '0x0000000000000000000000000000000000000000',
              decimals: 18,
              symbol: 'BNB',
            },
            value: '40000000000000000',
          },
          outputAmount: {
            currency: {
              address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
              decimals: 18,
              symbol: 'CAKE',
            },
            value: '4983293793789930646',
          },
          inputAmountWithGasAdjusted: {
            currency: {
              address: '0x0000000000000000000000000000000000000000',
              decimals: 18,
              symbol: 'BNB',
            },
            value: '40000000000000000',
          },
          outputAmountWithGasAdjusted: {
            currency: {
              address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
              decimals: 18,
              symbol: 'CAKE',
            },
            value: '4983293793686075663',
          },
          gasUseEstimateQuote: {
            currency: {
              address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
              decimals: 18,
              symbol: 'CAKE',
            },
            value: '103854983',
          },
          gasUseEstimateBase: {
            currency: {
              address: '0x0000000000000000000000000000000000000000',
              decimals: 18,
              symbol: 'BNB',
            },
            value: '820000',
          },
          percent: 100,
        },
      ],

      gasUseEstimateBase: {
        currency: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'BNB',
        },
        value: '820000',
      },
      gasUseEstimateQuote: {
        currency: {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
        value: '103854983',
      },
      inputAmountWithGasAdjusted: {
        currency: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'BNB',
        },
        value: '40000000000000000',
      },
      outputAmountWithGasAdjusted: {
        currency: {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
        value: '4983293793686075663',
      },
      gasUseEstimate: '82000',
      inputAmount: {
        currency: {
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
          symbol: 'BNB',
        },
        value: '40000000000000000',
      },
      outputAmount: {
        currency: {
          address: '0x2779106e4F4A8A28d77A24c18283651a2AE22D1C',
          decimals: 18,
          symbol: 'CAKE',
        },
        value: '4983293793789930646',
      },
      tradeType: 0,
    })
  })
})
