import { useMemo } from 'react'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { FAST_INTERVAL } from 'config/constants'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const { chainId } = useActiveChainId()

  const { data: totalSupplyStr } = useQuery(
    ['totalSupply', chainId, token?.isToken ? token.address : undefined],
    async () => {
      const data = await publicClient({ chainId }).readContract({
        abi: erc20ABI,
        address: token?.isToken ? token.address : undefined,
        functionName: 'totalSupply',
      })
      return data?.toString()
    },
    {
      refetchInterval: FAST_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: token?.isToken,
    },
  )

  return useMemo(
    () => (token?.isToken && totalSupplyStr ? CurrencyAmount.fromRawAmount(token, totalSupplyStr) : undefined),
    [token, totalSupplyStr],
  )
}

export default useTotalSupply
