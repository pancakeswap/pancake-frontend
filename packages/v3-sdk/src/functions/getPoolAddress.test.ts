import { Token } from '@pancakeswap/sdk'
import { describe, expect, test } from 'vitest'
import { FeeAmount } from '../constants'
import { getPoolAddress } from './getPoolAddress'

describe('getPoolAddress', () => {
  const USDC = new Token(1, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
  const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const USDC_DAI_LOW = '0xE40990F2BEdE27F483bD400e68A338b20d31A72d'
  test('USDC/DAI low fee', () => {
    expect(getPoolAddress(USDC, DAI, FeeAmount.LOW)).toEqual(USDC_DAI_LOW)
  })

  test('accept wrong order', () => {
    expect(getPoolAddress(DAI, USDC, FeeAmount.LOW)).toEqual(USDC_DAI_LOW)
  })

  test('wrong fee', () => {
    expect(getPoolAddress(USDC, DAI, FeeAmount.HIGH)).not.toEqual(USDC_DAI_LOW)
  })

  test('not same chain', () => {
    const USDC_BSC = new Token(56, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
    expect(() => getPoolAddress(USDC, USDC_BSC, FeeAmount.LOW)).toThrow('CHAIN_IDS')
  })
})
