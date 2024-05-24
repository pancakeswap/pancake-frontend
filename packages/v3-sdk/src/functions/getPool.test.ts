import { Ether, Token, WETH9 } from '@pancakeswap/sdk'
import { describe, expect, it } from 'vitest'
import { FeeAmount, TICK_SPACINGS } from '../constants'
import { encodeSqrtRatioX96 } from '../utils'
import { getPool } from './getPool'

describe('getPool', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  it('cannot be used for tokens on different chains', () => {
    expect(() => {
      return getPool({
        currencyA: USDC,
        currencyB: WETH9[5],
        fee: FeeAmount.MEDIUM,
        sqrtRatioX96: encodeSqrtRatioX96(1, 1),
        liquidity: 0,
        tickCurrent: 0,
        tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
        ticks: [],
      })
    }).toThrow('CHAIN_IDS')
  })

  it('fee must be integer', () => {
    expect(() => {
      return getPool({
        currencyA: USDC,
        currencyB: WETH9[1],
        fee: FeeAmount.MEDIUM + 0.5,
        tickSpacing: 1,
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
        currencyA: USDC,
        currencyB: WETH9[1],
        fee: FeeAmount.HIGH + 1e6,
        tickSpacing: 1,
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
        currencyA: USDC,
        currencyB: USDC,
        fee: FeeAmount.MEDIUM,
        tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
        sqrtRatioX96: encodeSqrtRatioX96(1, 1),
        liquidity: 0,
        tickCurrent: 0,
        ticks: [],
      })
    }).toThrow('ADDRESSES')
  })

  it('can accept native currency', () => {
    const pool = getPool({
      currencyA: USDC,
      currencyB: Ether.onChain(1),
      fee: FeeAmount.MEDIUM,
      tickSpacing: TICK_SPACINGS[FeeAmount.MEDIUM],
      sqrtRatioX96: encodeSqrtRatioX96(1, 1),
      liquidity: 0,
      tickCurrent: 0,
      ticks: [],
    })
    expect(pool.currency0).toEqual(Ether.onChain(1))
    expect(pool.currency1).toEqual(USDC)
  })
})
