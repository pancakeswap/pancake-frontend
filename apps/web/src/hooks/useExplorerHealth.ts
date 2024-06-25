import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useInitialBlockNumber } from '@pancakeswap/wagmi'
import { useMemo } from 'react'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { ApiStatus } from 'hooks/types'

export type ExplorerHealthState = {
  status: ApiStatus
  chainId: number
  protocol: string
  currentBlock: number
  latestBlock: number
  blockDifference: number
}

const NOT_OK_BLOCK_DIFFERENCE = 200 // ~15 minutes delay
const WARNING_BLOCK_DIFFERENCE = 50 // ~2.5 minute delay

const useExplorerHealth = ({ chainId, protocol }: { chainId: ChainId; protocol: 'v2' | 'v3' | 'stable' }) => {
  const { data: initialBlockBN = 0 } = useInitialBlockNumber({
    chainId,
  })

  const initialBlock = useMemo(() => Number(initialBlockBN), [initialBlockBN])

  const { data: currentBlockNumber = 0 } = useQuery<number>({
    queryKey: [SLOW_INTERVAL, 'blockNumber', chainId],
    enabled: false,
  })

  const { data: exHealth } = useQuery<ExplorerHealthState>({
    queryKey: ['exHealth', chainId, protocol, currentBlockNumber || initialBlock],
    placeholderData: (prev) => {
      if (!prev || prev.chainId !== chainId || prev.protocol !== protocol) {
        return {
          status: ApiStatus.UNKNOWN,
          currentBlock: 0,
          chainHeadBlock: 0,
          latestBlock: 0,
          blockDifference: 0,
          chainId: chainId!,
          protocol: protocol!,
        }
      }
      return prev
    },
    gcTime: SLOW_INTERVAL,
    queryFn: async ({ signal }) => {
      try {
        const chainName = chainIdToExplorerInfoChainName[chainId]
        const [data, currentBlock] = await Promise.all([
          explorerApiClient
            .GET('/status/{protocol}/{chainName}', {
              signal,
              params: {
                path: {
                  protocol: protocol!,
                  chainName,
                },
              },
            })
            .then((res) => res.data),
          currentBlockNumber ? Promise.resolve(currentBlockNumber) : Promise.resolve(initialBlock),
        ])

        if (!data) {
          return {
            status: ApiStatus.DOWN,
            currentBlock: -1,
            chainHeadBlock: 0,
            latestBlock: -1,
            blockDifference: 0,
            chainId: chainId!,
            protocol: protocol!,
          }
        }

        const explorerBlockHeight = data.height

        const isHealthy = explorerBlockHeight > 0
        const blockDifference = currentBlock - explorerBlockHeight
        const exHealthData = {
          currentBlock,
          latestBlock: explorerBlockHeight,
          blockDifference,
          chainId: chainId!,
          protocol: protocol!,
        }
        if (!isHealthy || blockDifference > NOT_OK_BLOCK_DIFFERENCE) {
          return {
            status: ApiStatus.NOT_OK,
            ...exHealthData,
          }
        }
        if (blockDifference > WARNING_BLOCK_DIFFERENCE) {
          return {
            status: ApiStatus.WARNING,
            ...exHealthData,
          }
        }
        return {
          status: ApiStatus.OK,
          ...exHealthData,
        }
      } catch (error) {
        console.error(`Failed to perform health check for ${protocol} explorer`, error)
        return {
          status: ApiStatus.DOWN,
          currentBlock: -1,
          latestBlock: -1,
          blockDifference: 0,
          chainId: chainId!,
          protocol: protocol!,
        }
      }
    },
    enabled: Boolean(initialBlock && chainId && protocol),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return exHealth!
}

export default useExplorerHealth
