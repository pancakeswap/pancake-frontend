import { JSBI, CurrencyAmount, Currency } from '@pancakeswap/sdk'

const PRECISION = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

export const getRawAmount = (amount: CurrencyAmount<Currency>) => {
  return JSBI.divide(
    JSBI.multiply(amount.quotient, PRECISION),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(amount.currency.decimals)),
  )
}

export const parseAmount = (currency: Currency, rawAmount: JSBI) => {
  return CurrencyAmount.fromRawAmount(
    currency,
    JSBI.divide(
      JSBI.multiply(rawAmount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals))),
      PRECISION,
    ),
  )
}
