import { Token, WETH9 } from '@pancakeswap/sdk'
import { zeroAddress } from 'viem'
import { describe, expect, test } from 'vitest'
import { hasInvolvedToken } from './hasInvolvedToken'
import { PoolState } from './poolState'

describe('hasInvolvedToken', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const UnknownToken = new Token(1, zeroAddress, 18, 'UN', 'UN')
  const pool = {
    token0: USDC,
    token1: DAI,
  } as PoolState

  test('success', () => {
    expect(hasInvolvedToken(pool, USDC)).toBeTruthy()
  })
  test('failed', () => {
    expect(hasInvolvedToken(pool, UnknownToken)).toBeFalsy()
    expect(hasInvolvedToken(pool, WETH9[1])).toBeFalsy()
  })
})
