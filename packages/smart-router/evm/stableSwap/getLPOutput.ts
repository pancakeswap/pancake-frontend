import { BigintIsh, CurrencyAmount, Currency, ZERO, Percent } from '@pancakeswap/sdk'
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
  if (lpTotalSupply === ZERO || !balances.length || balances.every((b) => b.quotient === ZERO)) {
    const d = getD({ amplifier, balances: amounts.map(getRawAmount) })
    return CurrencyAmount.fromRawAmount(lpToken, d)
  }

  const currentBalances: bigint[] = []
  const newBalances: bigint[] = []
  for (const [i, balance] of balances.entries()) {
    const amount = amounts[i] || CurrencyAmount.fromRawAmount(balance.currency, 0)
    invariant(
      amount.currency.wrapped.equals(balance.currency.wrapped),
      'User input currency should be the same as pool balance currency.',
    )
    const balanceRaw = getRawAmount(balance)
    const amountRaw = getRawAmount(amount)
    currentBalances.push(balanceRaw)
    newBalances.push(balanceRaw + amountRaw)
  }

  const d0 = getD({ amplifier, balances: currentBalances })
  const d1 = getD({ amplifier, balances: newBalances })
  invariant(d1 >= d0, 'D1 should be greater than or equal than d0.')

  const isFirstSupply = lpTotalSupply <= ZERO
  if (isFirstSupply) {
    return CurrencyAmount.fromRawAmount(totalSupply.currency, d1)
  }

  const n = currentBalances.length
  const eachTokenFee = fee.multiply(n).divide(4 * (n - 1))

  let d2 = d1
  for (const [i, b] of currentBalances.entries()) {
    const idealBalance = (d1 * b) / d0
    let diff = ZERO
    if (idealBalance > newBalances[i]) {
      diff = idealBalance - newBalances[i]
    } else {
      diff = newBalances[i] - idealBalance
    }
    const feeAmount = eachTokenFee.multiply(diff).quotient
    // eslint-disable-next-line operator-assignment
    newBalances[i] = newBalances[i] - feeAmount
  }
  d2 = getD({ amplifier, balances: newBalances })

  const expectedMintLP = (lpTotalSupply * (d2 - d0)) / d0
  return CurrencyAmount.fromRawAmount(totalSupply.currency, expectedMintLP)
}
