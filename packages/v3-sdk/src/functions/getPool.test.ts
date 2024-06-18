import { Token, WETH9 } from '@pancakeswap/sdk'
import { describe, expect, it } from 'vitest'
import { FeeAmount } from '../constants'
import { encodeSqrtRatioX96 } from '../utils'
import { getPool } from './getPool'

describe('getPool', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  it('cannot be used for tokens on different chains', () => {
    expect(() => {
      return getPool({
        tokenA: USDC,
        tokenB: WETH9[5],
        fee: FeeAmount.MEDIUM,
        sqrtRatioX96: encodeSqrtRatioX96(1, 1),
        liquidity: 0,
        tickCurrent: 0,
        ticks: [],
      })
    }).toThrow('CHAIN_IDS')
  })

  it('fee must be integer', () => {
    expect(() => {
      return getPool({
        tokenA: USDC,
        tokenB: WETH9[1],
        fee: FeeAmount.MEDIUM + 0.5,
        sqrtRatioX96: encodeSqrtRatioX96(1, 1),
        liquidity: 0,
        tickCurrent: 0,
        ticks: [],
      })
    }).toThrow('FEE')
  })

  it('fee cannot be more than 1e6', () => {
    expect(() => {
      return getPool({
        tokenA: USDC,
        tokenB: WETH9[1],
        fee: FeeAmount.HIGH + 1e6,
        sqrtRatioX96: encodeSqrtRatioX96(1, 1),
        liquidity: 0,
        tickCurrent: 0,
        ticks: [],
      })
    }).toThrow('FEE')
  })

  it('cannot be given two of the same token', () => {
    expect(() => {
      return getPool({
        tokenA: USDC,
        tokenB: USDC,
        fee: FeeAmount.MEDIUM,
        sqrtRatioX96: encodeSqrtRatioX96(1, 1),
        liquidity: 0,
        tickCurrent: 0,
        ticks: [],
      })
    }).toThrow('ADDRESSES')
  })
})
