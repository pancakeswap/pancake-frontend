import { BigintIsh, CurrencyAmount, Currency, Percent, ZERO, ONE_HUNDRED_PERCENT } from '@pancakeswap/sdk'
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
  const validateAmountOut = (a: CurrencyAmount<Currency>) =>
    invariant(!a.lessThan(ZERO), 'Insufficient liquidity to perform the swap')

  let i: number | null = null
  let j: number | null = null
  const balances: bigint[] = []
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
  if (amount.quotient < ZERO) {
    const x = ONE_HUNDRED_PERCENT.subtract(fee).invert().multiply(getRawAmount(amount)).quotient
    const y = getY({ amplifier, balances, i, j, x })
    const dy = y - balances[j]
    const amountOut = parseAmount(outputCurrency, dy)
    validateAmountOut(amountOut)
    return amountOut
  }

  const y = getY({ amplifier, balances, i, j, x: getRawAmount(amount) })
  const dy = balances[j] - y
  const feeAmount = fee.multiply(dy).quotient
  const amountOut = parseAmount(outputCurrency, dy - feeAmount)
  validateAmountOut(amountOut)
  return amountOut
}

export function getSwapOutputWithoutFee(params: Omit<GetSwapOutputParams, 'fee'>): CurrencyAmount<Currency> {
  return getSwapOutput({ ...params, fee: new Percent(0) })
}

export function getSwapInput({ amount, ...rest }: GetSwapOutputParams) {
  return getSwapOutput({
    ...rest,
    amount: CurrencyAmount.fromRawAmount(amount.currency, -amount.quotient),
  })
}

export function getSwapInputWithtouFee(params: Omit<GetSwapOutputParams, 'fee'>) {
  return getSwapInput({ ...params, fee: new Percent(0) })
}
