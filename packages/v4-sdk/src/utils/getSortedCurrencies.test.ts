import { Ether, WETH9 } from '@pancakeswap/sdk'
import { describe, expect, it } from 'vitest'
import { getSortedCurrencies } from './getSortedCurrencies'

describe('getSortedCurrencies', () => {
  const currencyA = Ether.onChain(1)
  const currencyB = WETH9[1]
  it('should reorder', () => {
    const [currency0, currency1] = getSortedCurrencies(currencyB, currencyA)
    expect(currency0).toEqual(currencyA)
    expect(currency1).toEqual(currencyB)
  })

  it('should not reorder', () => {
    const [currency0, currency1] = getSortedCurrencies(currencyA, currencyB)
    expect(currency0).toEqual(currencyA)
    expect(currency1).toEqual(currencyB)
  })
})
