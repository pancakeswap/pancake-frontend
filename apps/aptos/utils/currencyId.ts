import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { APT } from 'config/coins'

export function currencyId(currency: Currency): string {
  if (currency?.isNative) return APT[2].address
  if (currency?.isToken) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
