import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { stringify } from 'querystring'
import { chains, defaultChain } from 'config/chains'
import { TokenAddressMap } from 'state/lists/hooks'
import convertStructTagToAddress from './convertStructTagToAddress'

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block',
  chainId?: number,
): string {
  const chain = chains.find((c) => c.id === chainId)
  if (!chain) return defaultChain.blockExplorers?.traceMove.url ?? ''
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers?.traceMove.url}/transaction/${data}`
    }
    case 'block': {
      return `${chain.blockExplorers?.traceMove.url}/block/${data}`
    }
    case 'token': {
      return `${chain.blockExplorers?.traceMove.url}/coin/${data}`
    }
    default: {
      return `${chain.blockExplorers?.traceMove.url}/search/${data}`
    }
  }
}

export function getBlockExploreLinkDefault(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block',
  chainId?: number,
): string {
  const chain = chains.find((c) => c.id === chainId)
  if (!chain) return defaultChain.blockExplorers?.default.url ?? ''
  const query = chain.blockExplorers?.default.params ? `?${stringify(chain.blockExplorers?.default.params)}` : ''
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers?.default.url}/txn/${data}${query}`
    }
    case 'token': {
      return `${chain.blockExplorers?.default.url}/account/${convertStructTagToAddress(data as string)}${query}`
    }
    default: {
      return `${chain.blockExplorers?.default.url}/account/${data}${query}`
    }
  }
}

export const isChainSupported = (network?: string): network is string =>
  !!network && chains.map((c) => c.network).includes(network.toLowerCase())

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
