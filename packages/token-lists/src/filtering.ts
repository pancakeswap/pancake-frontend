import { Token } from '@pancakeswap/swap-sdk-core'
import { TokenInfo } from './types'

export function createFilterToken<T extends TokenInfo | Token>(
  search: string,
  isAddress: (address: string) => boolean,
): (token: T) => boolean {
  if (isAddress(search)) {
    const address = search.toLowerCase()
    return (t: T) => 'address' in t && address === t.address.toLowerCase()
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return () => true
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }
  return (token) => {
    const { symbol, name } = token
    return Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
  }
}
