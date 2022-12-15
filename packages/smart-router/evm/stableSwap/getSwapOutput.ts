import { BigintIsh, CurrencyAmount, Currency, JSBI, Percent } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

import { getY } from './amm'

export interface GetSwapOutputParams {
  amplifier: BigintIsh
  // Token balances of the stable pool
  balances: CurrencyAmount<Currency>[]
  // User input amount
  amount: CurrencyAmount<Currency>
  // The currency user want to swap to
  outputCurrency: Currency
  // Fee of swapping
  fee: Percent
}

export function getSwapOutput({
  amplifier,
  balances: balanceAmounts,
  outputCurrency,
  amount,
  fee,
}: GetSwapOutputParams): CurrencyAmount<Currency> {
  let i: number | null = null
  let j: number | null = null
  const balances: JSBI[] = []
  for (const [index, b] of balanceAmounts.entries()) {
    balances.push(b.quotient)
    if (b.currency.equals(amount.currency)) {
      i = index
      // eslint-disable-next-line no-continue
      continue
    }
    if (b.currency.equals(outputCurrency)) {
      j = index
      // eslint-disable-next-line no-continue
      continue
    }
  }

  invariant(
    i !== null && j !== null && i !== j,
    'Input currency or output currency does not match currencies of token balances.',
  )

  const y = getY({ amplifier, balances, i, j, x: amount.quotient })
  const dy = JSBI.subtract(balances[j], y)
  const feeAmount = fee.multiply(dy).quotient
  return CurrencyAmount.fromRawAmount(outputCurrency, JSBI.subtract(dy, feeAmount))
}

export function getSwapOutputWithoutFee(params: Omit<GetSwapOutputParams, 'fee'>): CurrencyAmount<Currency> {
  return getSwapOutput({ ...params, fee: new Percent(0) })
}
