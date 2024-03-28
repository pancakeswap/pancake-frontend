import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { erc20Abi } from 'viem'

import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'

function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  allowance: CurrencyAmount<Token> | undefined
  refetch: () => Promise<QueryObserverResult<bigint>>
} {
  const { chainId } = useActiveChainId()

  const inputs = useMemo(() => [owner, spender] as [`0x${string}`, `0x${string}`], [owner, spender])

  const { data: allowance, refetch } = useQuery({
    queryKey: [chainId, token?.address, owner, spender],

    queryFn: () => {
      if (!token) {
        throw new Error('No token')
      }
      return publicClient({ chainId }).readContract({
        abi: erc20Abi,
        address: token?.address,
        functionName: 'allowance',
        args: inputs,
      })
    },

    refetchInterval: FAST_INTERVAL,
    retry: true,
    refetchOnWindowFocus: false,
    enabled: Boolean(spender && owner && token),
  })

  return useMemo(
    () => ({
      allowance:
        token && typeof allowance !== 'undefined'
          ? CurrencyAmount.fromRawAmount(token, allowance.toString())
          : undefined,
      refetch,
    }),
    [token, refetch, allowance],
  )
}

export default useTokenAllowance
