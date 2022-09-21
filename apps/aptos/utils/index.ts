import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { TxnBuilderTypes } from 'aptos'
import { chains, defaultChain } from 'config/chains'
import { TokenAddressMap } from 'state/lists/hooks'

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainId?: number,
): string {
  const chain = chains.find((c) => c.id === chainId)
  if (!chain) return defaultChain.blockExplorers?.default.url ?? ''
  // only Devnet is capital
  const query = `?network=${chain.network === 'devnet' ? 'Devnet' : chain.id}`
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers?.default.url}/txn/${data}${query}`
    }
    default: {
      return `${chain.blockExplorers?.default.url}/account/${data}${query}`
    }
  }
}

export const isChainSupported = (network?: string): network is string =>
  !!network && chains.map((c) => c.network).includes(network.toLowerCase())

// still find a best way to verify it
export const isAddress = (addr: string) =>
  addr.startsWith('0x') && (TxnBuilderTypes.AccountAddress.fromHex(addr) ? addr : undefined)

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
