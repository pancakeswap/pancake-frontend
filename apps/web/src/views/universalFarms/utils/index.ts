import { CHAINS } from 'config/chains'
import type { ChainId } from '@pancakeswap/chains'

export function addQueryToPath(path: string, queryParams: { [key: string]: string }) {
  const [pathname, search] = path.split('?')
  const searchParams = new URLSearchParams(search)

  Object.keys(queryParams).forEach((key) => {
    searchParams.set(key, queryParams[key])
  })

  return `${pathname}?${searchParams.toString()}`
}

export function getChainFullName(chainId: ChainId) {
  return CHAINS.find((chain) => chain.id === chainId)?.name
}
