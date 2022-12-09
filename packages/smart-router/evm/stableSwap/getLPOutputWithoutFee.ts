import { BigintIsh, CurrencyAmount, Currency, JSBI, ZERO } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

import { getD } from './amm'

interface GetSlippageParams {
  amplifier: BigintIsh
  // Token balances of the stable pool
  balances: CurrencyAmount<Currency>[]
  // User input amounts
  amounts: CurrencyAmount<Currency>[]
  // Total supply of LP token
  totalSupply: CurrencyAmount<Currency>
}

export function getLPOutputWithoutFee({
  amplifier,
  balances,
  totalSupply,
  amounts,
}: GetSlippageParams): CurrencyAmount<Currency> {
  const lpToken = totalSupply.currency
  const lpTotalSupply = totalSupply.quotient
  // No liquidity in pool
  if (JSBI.equal(lpTotalSupply, ZERO) || !balances.length || balances.every((b) => JSBI.equal(b.quotient, ZERO))) {
    const d = getD({ amplifier, balances: amounts.map((a) => a.quotient) })
    return CurrencyAmount.fromRawAmount(lpToken, d)
  }

  const currentBalances: JSBI[] = []
  const newBalances: JSBI[] = []
  for (const [i, balance] of balances.entries()) {
    const amount = amounts[i] || CurrencyAmount.fromRawAmount(balance.currency, 0)
    invariant(
      amount.currency.equals(balance.currency),
      'User input currency should be the same as pool balance currency.',
    )
    currentBalances.push(balance.quotient)
    newBalances.push(JSBI.add(balance.quotient, amount.quotient))
  }

  const d0 = getD({ amplifier, balances: currentBalances })
  invariant(JSBI.notEqual(d0, ZERO), 'Unexpected zero value of D0.')
  const d1 = getD({ amplifier, balances: newBalances })
  invariant(JSBI.greaterThanOrEqual(d1, d0), 'D1 should be greater than or equal than d0.')

  const expectedMintLP = JSBI.divide(JSBI.multiply(lpTotalSupply, JSBI.subtract(d1, d0)), d0)
  return CurrencyAmount.fromRawAmount(totalSupply.currency, expectedMintLP)
}
