import { BigintIsh, CurrencyAmount, Currency, JSBI, Percent, ZERO, ONE_HUNDRED_PERCENT } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

import { getY } from './amm'
import { getRawAmount, parseAmount } from './utils'

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
    balances.push(getRawAmount(b))
    if (b.currency.wrapped.equals(amount.currency.wrapped)) {
      i = index
      // eslint-disable-next-line no-continue
      continue
    }
    if (b.currency.wrapped.equals(outputCurrency.wrapped)) {
      j = index
      // eslint-disable-next-line no-continue
      continue
    }
  }

  invariant(
    i !== null && j !== null && i !== j,
    'Input currency or output currency does not match currencies of token balances.',
  )

  // Exact output
  if (JSBI.lessThan(amount.quotient, ZERO)) {
    const x = ONE_HUNDRED_PERCENT.subtract(fee).invert().multiply(getRawAmount(amount)).quotient
    const y = getY({ amplifier, balances, i, j, x })
    const dy = JSBI.subtract(y, balances[j])
    return parseAmount(outputCurrency, dy)
  }

  const y = getY({ amplifier, balances, i, j, x: getRawAmount(amount) })
  const dy = JSBI.subtract(balances[j], y)
  const feeAmount = fee.multiply(dy).quotient
  return parseAmount(outputCurrency, JSBI.subtract(dy, feeAmount))
}

export function getSwapOutputWithoutFee(params: Omit<GetSwapOutputParams, 'fee'>): CurrencyAmount<Currency> {
  return getSwapOutput({ ...params, fee: new Percent(0) })
}

export function getSwapInput({ amount, ...rest }: GetSwapOutputParams) {
  return getSwapOutput({
    ...rest,
    amount: CurrencyAmount.fromRawAmount(amount.currency, JSBI.unaryMinus(amount.quotient)),
  })
}

export function getSwapInputWithtouFee(params: Omit<GetSwapOutputParams, 'fee'>) {
  return getSwapInput({ ...params, fee: new Percent(0) })
}
