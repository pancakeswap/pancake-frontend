import { Token, CurrencyAmount } from '@pancakeswap/sdk'
import { erc20ABI } from 'wagmi'
import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { FAST_INTERVAL } from 'config/constants'

function useTokenAllowance(
  token?: Token,
  owner?: string,
  spender?: string,
): {
  allowance: CurrencyAmount<Token> | undefined
  refetch: () => Promise<any>
} {
  const { chainId } = useActiveChainId()

  const inputs = useMemo(() => [owner, spender] as [`0x${string}`, `0x${string}`], [owner, spender])

  const { data: allowance, refetch } = useQuery(
    [chainId, token?.address, owner, spender],
    () => {
      if (!token) {
        throw new Error('No token')
      }
      return publicClient({ chainId }).readContract({
        abi: erc20ABI,
        address: token?.address,
        functionName: 'allowance',
        args: inputs,
      })
    },
    {
      refetchInterval: FAST_INTERVAL,
      retry: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(spender && owner && token),
    },
  )

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
