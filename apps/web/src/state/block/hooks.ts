import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlock, useWatchBlocks, useBlockNumber } from 'wagmi'
import { useEffect } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'

export const usePollBlockNumber = () => {
  const queryClient = useQueryClient()
  const { chainId } = useActiveChainId()
  const { data: initialBlock } = useBlock({
    chainId,
    blockTag: 'latest',
  })

  useEffect(() => {
    if (!initialBlock) {
      return
    }

    const { number: blockNumber, timestamp: blockTimestamp } = initialBlock
    queryClient.setQueryData(['blockNumber', chainId], blockNumber)
    if (
      !queryClient.getQueryCache().find({
        queryKey: ['initialBlockNumber', chainId],
      })?.state?.data
    ) {
      queryClient.setQueryData(['initialBlockNumber', chainId], blockNumber)
    }

    if (
      !queryClient.getQueryCache().find({
        queryKey: ['initialBlockTimestamp', chainId],
      })?.state?.data
    ) {
      queryClient.setQueryData(['initialBlockTimestamp', chainId], Number(blockTimestamp))
    }
  }, [chainId, initialBlock, queryClient])

  useWatchBlocks({
    chainId,
    blockTag: 'latest',
    onBlock: (data) => {
      const blockNumber = Number(data.number)
      const timestamp = Number(data.timestamp)
      queryClient.setQueryData(['blockNumber', chainId], blockNumber)
      queryClient.setQueryData(['blockTimestamp', chainId], timestamp)
    },
  })

  const { data: blockNumber } = useQuery({
    queryKey: ['blockNumber', chainId],
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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

export function useCurrentBlockTimestamp() {
  const { chainId } = useActiveChainId()
  const { data: timestamp } = useQuery<number>({
    queryKey: ['blockTimestamp', chainId],
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return timestamp
}

export const useChainCurrentBlock = (chainId: number) => {
  const { chainId: activeChainId } = useActiveChainId()
  const activeChainBlockNumber = useCurrentBlock()
  const isTargetDifferent = Boolean(chainId && activeChainId !== chainId)
  const { data: currentBlock } = useBlockNumber({
    chainId,
    watch: true,
    query: {
      enabled: Boolean(isTargetDifferent),
    },
  })
  const targetChainBlockNumber = currentBlock !== undefined ? Number(currentBlock) : undefined

  return isTargetDifferent ? targetChainBlockNumber : activeChainBlockNumber
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
