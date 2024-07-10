import { Ether, Token, WETH9 } from '@pancakeswap/sdk'
import { zeroAddress } from 'viem'
import { describe, expect, test } from 'vitest'
import { hasInvolvedCurrency } from './hasInvolvedCurrency'

describe('hasInvolvedToken', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const UnknownToken = new Token(1, zeroAddress, 18, 'UN', 'UN')
  const pool1 = {
    currency0: DAI,
    currency1: USDC,
  }

  const pool2 = {
    currency0: Ether.onChain(1),
    currency1: DAI,
  }

  test('success', () => {
    expect(hasInvolvedCurrency(pool1, USDC)).toBeTruthy()
    expect(hasInvolvedCurrency(pool1, DAI)).toBeTruthy()
    expect(hasInvolvedCurrency(pool2, DAI)).toBeTruthy()
    expect(hasInvolvedCurrency(pool2, Ether.onChain(1))).toBeTruthy()
  })
  test('failed', () => {
    expect(hasInvolvedCurrency(pool1, UnknownToken)).toBeFalsy()
    expect(hasInvolvedCurrency(pool1, WETH9[1])).toBeFalsy()
    expect(hasInvolvedCurrency(pool2, Ether.onChain(56))).toBeFalsy()
  })
})
