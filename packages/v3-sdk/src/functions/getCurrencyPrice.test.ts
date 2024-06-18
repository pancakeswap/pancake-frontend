import { Ether, Token } from '@pancakeswap/sdk'
import { describe, expect, test } from 'vitest'
import { encodeSqrtRatioX96 } from '../utils'
import { getCurrency0Price, getCurrency1Price } from './getCurrencyPrice'

describe('getCurrencyPrice', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  test('token0price', () => {
    expect(getCurrency0Price([DAI, USDC], encodeSqrtRatioX96(101e6, 100e18)).toSignificant(5)).toEqual('1.01')
    expect(getCurrency0Price([USDC, DAI], encodeSqrtRatioX96(100e18, 101e6)).toSignificant(5)).toEqual('0.9901')
    expect(getCurrency0Price([Ether.onChain(1), USDC], encodeSqrtRatioX96(101e6, 100e18)).toSignificant(5)).toEqual(
      '1.01'
    )
  })
  test('token1price', () => {
    const token1Price = getCurrency1Price([DAI, USDC], encodeSqrtRatioX96(100e18, 101e6))
    expect(token1Price.toSignificant(5)).toEqual('0.9901')

    expect(getCurrency1Price([DAI, USDC], encodeSqrtRatioX96(100e18, 101e6)).toSignificant(5)).toEqual('0.9901')
    expect(getCurrency1Price([USDC, DAI], encodeSqrtRatioX96(101e6, 100e18)).toSignificant(5)).toEqual('1.01')
    expect(getCurrency1Price([Ether.onChain(1), USDC], encodeSqrtRatioX96(100e18, 101e6)).toSignificant(5)).toEqual(
      '0.9901'
    )
  })
})
