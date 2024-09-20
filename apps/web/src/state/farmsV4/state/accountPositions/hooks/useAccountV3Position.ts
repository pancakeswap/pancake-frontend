import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { readPositions } from '../fetcher/v3'

export const useAccountV3Position = (chainId?: number, tokenId?: bigint) => {
  return useQuery({
    queryKey: ['accountV3Position', chainId, tokenId?.toString()],
    queryFn: () => readPositions(chainId!, [tokenId!]),
    select: (data) => data[0],
    enabled: !!tokenId && !!chainId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
}
