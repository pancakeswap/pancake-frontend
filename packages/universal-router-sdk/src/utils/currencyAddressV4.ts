import { Currency } from '@pancakeswap/sdk'

export function currencyAddressV4(currency: Currency) {
  return currency.isNative ? '0x0' : currency.wrapped.address
}
