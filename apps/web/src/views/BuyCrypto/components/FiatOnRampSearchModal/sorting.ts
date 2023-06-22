import { Token, getTokenComparator } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { useAllTokenBalances } from 'state/wallet/hooks'

function useTokenComparator(inverted: boolean): (tokenA: Token, tokenB: Token) => number {
  const balances = useAllTokenBalances()
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances])
  return useMemo(() => {
    if (inverted) {
      return (tokenA: Token, tokenB: Token) => comparator(tokenA, tokenB) * -1
    }
    return comparator
  }, [inverted, comparator])
}

export default useTokenComparator
