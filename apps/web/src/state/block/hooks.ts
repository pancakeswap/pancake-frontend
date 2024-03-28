import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
// eslint-disable-next-line camelcase
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useBlockNumber, usePublicClient } from 'wagmi'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const queryClient = useQueryClient()
  const { chainId } = useActiveChainId()
  const { data: blockNumber } = useBlockNumber({
    chainId,
  })

  useQuery({
    queryKey: ['blockNumberFetcher', chainId],

    queryFn: async () => {
      queryClient.setQueryData(['blockNumber', chainId], Number(blockNumber))
      return null
    },

    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useQuery({
    queryKey: [FAST_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId),
    refetchInterval: FAST_INTERVAL,
  })

  useQuery({
    queryKey: [SLOW_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId),
    refetchInterval: SLOW_INTERVAL,
  })
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: currentBlock = 0 } = useQuery({
    queryKey: ['blockNumber', chainId],
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return Number(currentBlock)
}

export const useChainCurrentBlock = (chainId: number): number => {
  const { chainId: activeChainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })

  const { data: currentBlock = 0 } = useQuery({
    queryKey: activeChainId === chainId ? ['blockNumber', chainId] : ['chainBlockNumber', chainId],

    queryFn: async () => {
      if (provider) {
        const blockNumber = await provider.getBlockNumber()
        return Number(blockNumber)
      }

      return undefined
    },
    enabled: activeChainId !== chainId,
    ...(activeChainId !== chainId && { refetchInterval: REFRESH_BLOCK_INTERVAL }),
  })
  return currentBlock
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlock = 0 } = useQuery({
    queryKey: ['initialBlockNumber', chainId],
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return Number(initialBlock)
}

export const useInitialBlockTimestamp = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlockTimestamp = 0 } = useQuery({
    queryKey: ['initialBlockTimestamp', chainId],
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return Number(initialBlockTimestamp)
}
