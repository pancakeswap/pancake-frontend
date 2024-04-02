import { Currency } from '@pancakeswap/swap-sdk-core'
import { zeroAddress } from 'viem'

export function areCurrenciesEqual(currency: Currency, address: string | null, chainId: number) {
  if (currency.chainId !== chainId) return false

  if (currency.isNative) {
    return address === zeroAddress
  }

  return currency.address.toLowerCase() === address?.toLowerCase()
}
