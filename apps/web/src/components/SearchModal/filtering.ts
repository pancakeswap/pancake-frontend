import { useMemo } from 'react'
import { TokenInfo } from '@pancakeswap/token-lists'
import { Token } from '@pancakeswap/sdk'
import { isAddress } from 'utils'

export function filterTokens(tokens: Token[], search: string): Token[] {
  if (search.length === 0) return tokens

  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    return tokens.filter((token) => token.address === searchingAddress)
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) {
    return tokens
  }

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s_) => s_.length > 0)

    return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
  }

  return tokens.filter((token) => {
    const { symbol, name } = token
    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  })
}

export function createFilterToken<T extends TokenInfo | Token>(search: string): (token: T) => boolean {
  const searchingAddress = isAddress(search)

  if (searchingAddress) {
    const address = searchingAddress.toLowerCase()
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
    return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
  }
}

export function useSortedTokensByQuery(tokens: Token[] | undefined, searchQuery: string): Token[] {
  return useMemo(() => {
    if (!tokens) {
      return []
    }

    const trimmedSearchQuery = searchQuery.toLowerCase().trim()

    const symbolMatch = trimmedSearchQuery.split(/\s+/).filter((s) => s.length > 0)

    if (symbolMatch.length > 1) {
      return tokens
    }

    const exactMatches: Token[] = []
    const symbolSubstrings: Token[] = []
    const rest: Token[] = []

    // sort tokens by exact match -> substring on symbol match -> rest
    tokens.forEach((token) => {
      const tokenSymbol = token.symbol?.toLowerCase()
      if (tokenSymbol === symbolMatch[0] || token.name?.toLowerCase() === trimmedSearchQuery) {
        return exactMatches.push(token)
      }
      if (tokenSymbol.startsWith(trimmedSearchQuery)) {
        return symbolSubstrings.push(token)
      }
      return rest.push(token)
    })

    return [...exactMatches, ...symbolSubstrings, ...rest]
  }, [tokens, searchQuery])
}
