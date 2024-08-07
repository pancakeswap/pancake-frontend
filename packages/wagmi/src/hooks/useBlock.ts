import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { useBlock, useWatchBlocks, useBlockNumber as useWagmiBlockNumber, usePublicClient } from 'wagmi'
import { useCallback, useEffect } from 'react'

type Params = {
  chainId?: number
  enabled?: boolean
}

function createKeyGetter(name: string) {
  return function getKey(chainId?: number) {
    return [name, chainId]
  }
}

const updateBlockQueryData = (
  queryClient: QueryClient,
  chainId: number | undefined,
  block: { number: bigint; timestamp: bigint },
) => {
  if (chainId) {
    const blockNumber = Number(block.number)
    const timestamp = Number(block.timestamp)

    queryClient.setQueryData(getBlockNumberQueryKey(chainId), blockNumber)
    queryClient.setQueryData(getBlockTimestampQueryKey(chainId), timestamp)
  }
}

export const getBlockNumberQueryKey = createKeyGetter('blockNumber')
export const getBlockTimestampQueryKey = createKeyGetter('blockTimestamp')
export const getInitialBlockNumberQueryKey = createKeyGetter('initialBlockNumber')
export const getInitialBlockTimestampQueryKey = createKeyGetter('initialBlockTimestamp')

export function useWatchBlock({ chainId, enabled }: Params) {
  const queryClient = useQueryClient()
  const queryEnabled = Boolean(chainId && enabled)
  const { data: initialBlock } = useBlock({
    chainId,
    blockTag: 'latest',
    query: {
      enabled: queryEnabled,
    },
  })

  useEffect(() => {
    if (!initialBlock) {
      return
    }

    const { number: blockNumber, timestamp: blockTimestamp } = initialBlock
    queryClient.setQueryData(getBlockNumberQueryKey(chainId), blockNumber)

    const initialBlockNumberQueryKey = getInitialBlockNumberQueryKey(chainId)
    if (
      !queryClient.getQueryCache().find({
        queryKey: initialBlockNumberQueryKey,
      })?.state?.data
    ) {
      queryClient.setQueryData(initialBlockNumberQueryKey, blockNumber)
    }

    const initialBlockTimestampQueryKey = getInitialBlockTimestampQueryKey(chainId)
    if (
      !queryClient.getQueryCache().find({
        queryKey: initialBlockTimestampQueryKey,
      })?.state?.data
    ) {
      queryClient.setQueryData(initialBlockTimestampQueryKey, Number(blockTimestamp))
    }
  }, [chainId, initialBlock, queryClient])

  useWatchBlocks({
    chainId,
    blockTag: 'latest',
    enabled: queryEnabled,
    onBlock: (data) => {
      updateBlockQueryData(queryClient, chainId, data)
    },
  })
}

export function useBlockNumber({
  chainId,
  watch,
}: Omit<Params, 'enabled'> & { watch?: boolean }):
  | ReturnType<typeof useWatchedBlockNumber>
  | ReturnType<typeof useWagmiBlockNumber> {
  const watchedBlockNumber = useWatchedBlockNumber({ chainId })
  const blockNumber = useWagmiBlockNumber({ chainId, query: { enabled: !watch }, watch: false })
  return watch ? watchedBlockNumber : blockNumber
}

export function useWatchedBlockNumber({ chainId }: Omit<Params, 'enabled'>) {
  return useQuery<bigint>({
    queryKey: getBlockNumberQueryKey(chainId),
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useBlockTimestamp({ chainId }: Omit<Params, 'enabled'>) {
  return useQuery<number>({
    queryKey: getBlockTimestampQueryKey(chainId),
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useInitialBlockNumber({ chainId }: Omit<Params, 'enabled'>) {
  return useQuery<bigint>({
    queryKey: getInitialBlockNumberQueryKey(chainId),
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useInitialBlockTimestamp({ chainId }: Omit<Params, 'enabled'>) {
  return useQuery<number>({
    queryKey: getInitialBlockTimestampQueryKey(chainId),
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useFetchBlockData = (chainId: number) => {
  const queryClient = useQueryClient()
  const provider = usePublicClient({ chainId })

  const refetchBlockData = useCallback(async () => {
    try {
      if (provider) {
        const block = await provider.getBlock()
        updateBlockQueryData(queryClient, chainId, block)
      }
    } catch (error) {
      console.error('Error fetching block data:', error)
    }
  }, [provider, queryClient, chainId])

  return refetchBlockData
}
