import { useMemo } from 'react'
import { Token } from '@pancakeswap/swap-sdk-core'

const useSortedTokensByQuery = (tokens: Token[] | undefined, searchQuery: string): Token[] => {
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

export default useSortedTokensByQuery
