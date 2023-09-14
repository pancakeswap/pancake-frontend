import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
// eslint-disable-next-line camelcase
import useSWR, { useSWRConfig, unstable_serialize } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useBlockNumber, usePublicClient } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { viemClients } from 'utils/viem'
import { useEffect } from 'react'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const { cache, mutate } = useSWRConfig()
  const { chainId } = useActiveChainId()
  const { data: blockNumber, isError, isLoading } = useBlockNumber()

  useSWR(
    chainId && ['blockNumberFetcher', chainId],
    async () => {
      mutate(['blockNumber', chainId], blockNumber)
    },
    {
      revalidateOnMount: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  useEffect(() => {
    const fetchInitialBlockTimestamp = async () => {
      const provider = viemClients[chainId as keyof typeof viemClients]
      const block = await provider.getBlock({ blockNumber })
      mutate(['initialBlockTimestamp', chainId], Number(block.timestamp))
    }
    if (!isLoading && !isError) {
      mutate(['blockNumber', chainId], blockNumber)
      if (!cache.get(unstable_serialize(['initialBlockNumber', chainId]))?.data) {
        mutate(['initialBlockNumber', chainId], blockNumber)
      }
      if (!cache.get(unstable_serialize(['initialBlockTimestamp', chainId]))?.data) {
        fetchInitialBlockTimestamp()
      }
    }
  }, [mutate, blockNumber, cache, chainId, isError, isLoading])

  useSWR(
    chainId && [FAST_INTERVAL, 'blockNumber', chainId],
    async () => {
      return blockNumber
    },
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  useSWR(
    chainId && [SLOW_INTERVAL, 'blockNumber', chainId],
    async () => {
      return blockNumber
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: currentBlock = 0 } = useSWRImmutable(['blockNumber', chainId])
  return Number(currentBlock)
}

export const useChainCurrentBlock = (chainId: number): number => {
  const { chainId: activeChainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const { data: currentBlock = 0 } = useSWR(
    chainId ? (activeChainId === chainId ? ['blockNumber', chainId] : ['chainBlockNumber', chainId]) : null,
    activeChainId !== chainId
      ? async () => {
          const blockNumber = await provider.getBlockNumber()
          return Number(blockNumber)
        }
      : undefined,
    activeChainId !== chainId
      ? {
          refreshInterval: REFRESH_BLOCK_INTERVAL,
        }
      : undefined,
  )
  return currentBlock
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlock = 0 } = useSWRImmutable(['initialBlockNumber', chainId])
  return Number(initialBlock)
}

export const useInitialBlockTimestamp = (): number => {
  const { chainId } = useActiveChainId()
  const { data: initialBlockTimestamp = 0 } = useSWRImmutable(['initialBlockTimestamp', chainId])
  return Number(initialBlockTimestamp)
}
