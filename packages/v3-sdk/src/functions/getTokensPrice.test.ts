import { Token } from '@pancakeswap/sdk'
import { describe, expect, test } from 'vitest'
import { encodeSqrtRatioX96 } from '../utils'
import { getTokensPrice } from './getTokensPrice'

describe('getTokensPrice', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  test('token0price', () => {
    const [token0Price, token1Price] = getTokensPrice(USDC, DAI, encodeSqrtRatioX96(101e6, 100e18))
    expect(token0Price.toSignificant(5)).toEqual('1.01')
  })
  test('token1price', () => {
    const [token0Price, token1Price] = getTokensPrice(DAI, USDC, encodeSqrtRatioX96(100e18, 101e6))
    expect(token1Price.toSignificant(5)).toEqual('0.9901')
  })

  test('token order', () => {
    const order1 = getTokensPrice(USDC, DAI, encodeSqrtRatioX96(100e18, 101e6))
    const order2 = getTokensPrice(DAI, USDC, encodeSqrtRatioX96(100e18, 101e6))

    expect(order1[0].toSignificant(5)).toEqual(order2[0].toSignificant(5))
    expect(order1[1].toSignificant(5)).toEqual(order2[1].toSignificant(5))
  })
})
