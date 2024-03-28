import { Token, WETH9 } from '@pancakeswap/sdk'
import { describe, expect, test } from 'vitest'
import { encodeSqrtRatioX96 } from '../utils'
import { getPriceOfToken } from './getPriceOfToken'

describe('getPriceOfToken', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  test('A', () => {
    const price = getPriceOfToken(USDC)(USDC, DAI, encodeSqrtRatioX96(101e6, 100e18))
    expect(price.toSignificant(5)).toEqual('1.01')
  })

  test('B', () => {
    const price = getPriceOfToken(DAI)(USDC, DAI, encodeSqrtRatioX96(100e18, 101e6))
    expect(price.toSignificant(5)).toEqual('0.9901')
  })

  test('wrong token', () => {
    expect(() => getPriceOfToken(WETH9[1])(DAI, USDC, encodeSqrtRatioX96(100e18, 101e6))).toThrow('TOKEN')
  })
})
