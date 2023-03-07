import { BigintIsh, CurrencyAmount, Currency, JSBI, ZERO, Percent } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

import { getD } from './amm'
import { getRawAmount } from './utils'

export interface GetLPOutputParams {
  amplifier: BigintIsh
  // Token balances of the stable pool
  balances: CurrencyAmount<Currency>[]
  // User input amounts
  amounts: CurrencyAmount<Currency>[]
  // Total supply of LP token
  totalSupply: CurrencyAmount<Currency>
  // Fee of adding liquidity
  fee: Percent
}

export function getLPOutput({
  amplifier,
  balances,
  totalSupply,
  amounts,
  fee,
}: GetLPOutputParams): CurrencyAmount<Currency> {
  const lpToken = totalSupply.currency
  const lpTotalSupply = totalSupply.quotient
  // No liquidity in pool
  if (JSBI.equal(lpTotalSupply, ZERO) || !balances.length || balances.every((b) => JSBI.equal(b.quotient, ZERO))) {
    const d = getD({ amplifier, balances: amounts.map(getRawAmount) })
    return CurrencyAmount.fromRawAmount(lpToken, d)
  }

  const currentBalances: JSBI[] = []
  const newBalances: JSBI[] = []
  for (const [i, balance] of balances.entries()) {
    const amount = amounts[i] || CurrencyAmount.fromRawAmount(balance.currency, 0)
    invariant(
      amount.currency.wrapped.equals(balance.currency.wrapped),
      'User input currency should be the same as pool balance currency.',
    )
    const balanceRaw = getRawAmount(balance)
    const amountRaw = getRawAmount(amount)
    currentBalances.push(balanceRaw)
    newBalances.push(JSBI.add(balanceRaw, amountRaw))
  }

  const d0 = getD({ amplifier, balances: currentBalances })
  const d1 = getD({ amplifier, balances: newBalances })
  invariant(JSBI.greaterThanOrEqual(d1, d0), 'D1 should be greater than or equal than d0.')

  const isFirstSupply = JSBI.lessThanOrEqual(lpTotalSupply, ZERO)
  if (isFirstSupply) {
    return CurrencyAmount.fromRawAmount(totalSupply.currency, d1)
  }

  const n = currentBalances.length
  const eachTokenFee = fee.multiply(n).divide(4 * (n - 1))

  let d2 = d1
  for (const [i, b] of currentBalances.entries()) {
    const idealBalance = JSBI.divide(JSBI.multiply(d1, b), d0)
    let diff = ZERO
    if (JSBI.greaterThan(idealBalance, newBalances[i])) {
      diff = JSBI.subtract(idealBalance, newBalances[i])
    } else {
      diff = JSBI.subtract(newBalances[i], idealBalance)
    }
    const feeAmount = eachTokenFee.multiply(diff).quotient
    newBalances[i] = JSBI.subtract(newBalances[i], feeAmount)
  }
  d2 = getD({ amplifier, balances: newBalances })

  const expectedMintLP = JSBI.divide(JSBI.multiply(lpTotalSupply, JSBI.subtract(d2, d0)), d0)
  return CurrencyAmount.fromRawAmount(totalSupply.currency, expectedMintLP)
}
