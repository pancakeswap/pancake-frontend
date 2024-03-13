import { describe, it, expect } from 'vitest'
import { CurrencyAmount, Percent } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'

import { getSwapOutput, getSwapInput } from './getSwapOutput'

describe('getSwapOutput', () => {
  it('Exact output should match exact input', () => {
    const params = {
      amplifier: 1000,
      balances: [
        CurrencyAmount.fromRawAmount(bscTokens.usdt, '45783656091242964455008335'),
        CurrencyAmount.fromRawAmount(bscTokens.busd, '67779343437455288075126268'),
      ],
      outputCurrency: bscTokens.busd,
      amount: CurrencyAmount.fromRawAmount(bscTokens.usdt, '2000000000000000000'),
      fee: new Percent('15000000', '10000000000'),
    }
    const exactIn = getSwapOutput(params)
    expect(exactIn.currency).toBe(bscTokens.busd)
    expect(exactIn.quotient).toEqual(1997834290490693375n)

    const exactOut = getSwapInput({
      ...params,
      outputCurrency: bscTokens.usdt,
      amount: CurrencyAmount.fromRawAmount(bscTokens.busd, '1997834290490693375'),
    })
    expect(exactOut.currency).toBe(bscTokens.usdt)
    expect(exactOut.quotient).toEqual(2000000000000000000n)
  })
})
