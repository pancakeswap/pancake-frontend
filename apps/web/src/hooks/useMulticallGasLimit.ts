import { ChainId } from '@pancakeswap/sdk'
import { getGasLimitOnChain } from '@pancakeswap/multicall'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getViemClients } from 'utils/viem'

export function useMulticallGasLimit(chainId?: ChainId) {
  const client = useMemo(() => getViemClients({ chainId }), [chainId])

  const { data: gasLimit } = useQuery({
    queryKey: [chainId],
    queryFn: async () => getGasLimitOnChain({ chainId, client }),
    enabled: Boolean(chainId && client),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  })

  return gasLimit
}
