import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCallback } from 'react'
import { readPositions } from '../fetcher/v3'
import { PositionDetail } from '../type'

export const useAccountV3Position = (chainId?: number, tokenId?: bigint) => {
  return useQuery({
    queryKey: ['accountV3Position', chainId, tokenId?.toString()],
    queryFn: () => readPositions(chainId!, [tokenId!]),
    select: useCallback((data: PositionDetail[]) => data[0], []),
    enabled: !!tokenId && !!chainId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
}
