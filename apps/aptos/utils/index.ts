import { Currency } from '@pancakeswap/sdk'
import { HexString } from 'aptos'
import { chains, defaultChain } from 'config/chains'
import { TokenAddressMap } from 'state/lists/hooks'

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  networkName?: string,
): string {
  const chain = chains.find((c) => c.network.toLowerCase() === networkName?.toLowerCase())
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

export const isAddress = (addr: string) => (HexString.ensure(addr) ? addr : undefined)

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
