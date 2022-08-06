import { Token, TokenAmount } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { SUGGESTED_BASES } from 'config/constants/exchange'
import { useAllTokenBalances } from '../../state/wallet/hooks'

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1
  }
  if (balanceA && balanceA.greaterThan('0')) {
    return -1
  }
  if (balanceB && balanceB.greaterThan('0')) {
    return 1
  }
  return 0
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined
}): (tokenA: Token, tokenB: Token) => number {
  return function sortTokens(tokenA: Token, tokenB: Token): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address]
    const balanceB = balances[tokenB.address]

    const balanceComp = balanceComparator(balanceA, balanceB)
    if (balanceComp !== 0) return balanceComp

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    }
    return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
  }
}

export function useTokenComparator(inverted: boolean): (tokenA: Token, tokenB: Token) => number {
  const balances = useAllTokenBalances()

  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1
    }
    return comparator
  }, [inverted, comparator])
}

export function finalSortTokens({ tokens, balances, chainId }) {
  const result = []

  let tokensTemp = tokens

  // Tokens with balances will be placed first
  tokens.forEach((token) => {
    const balance = Number(balances[token.address]?.toSignificant(4))
    if (Number.isNaN(balance) || balance === 0) {
      return
    }

    result.push(token)

    tokensTemp = tokensTemp.filter((_token) => _token.symbol.toLowerCase() !== token.symbol.toLowerCase())
  })

  // PinToken will be placed second
  SUGGESTED_BASES[chainId].forEach((token) => {
    const matchToken = tokensTemp.find((_token) => _token.symbol.toLowerCase() === token.symbol.toLowerCase())
    if (typeof matchToken === 'undefined') {
      return
    }

    result.push(matchToken)

    tokensTemp = tokensTemp.filter((_token) => _token.symbol.toLowerCase() !== matchToken.symbol.toLowerCase())
  })

  tokensTemp.forEach((token) => {
    result.push(token)
  })

  return result
}
