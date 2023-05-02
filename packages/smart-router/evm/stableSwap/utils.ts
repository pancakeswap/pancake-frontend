import { CurrencyAmount, Currency } from '@pancakeswap/sdk'

const PRECISION = 10n ** 18n

export const getRawAmount = (amount: CurrencyAmount<Currency>) => {
  return (amount.quotient * PRECISION) / 10n ** BigInt(amount.currency.decimals)
}

export const parseAmount = (currency: Currency, rawAmount: bigint) => {
  return CurrencyAmount.fromRawAmount(currency, (rawAmount * 10n ** BigInt(currency.decimals)) / PRECISION)
}
