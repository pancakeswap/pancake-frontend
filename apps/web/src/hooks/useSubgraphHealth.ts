import { request, gql } from 'graphql-request'
import { GRAPH_HEALTH } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useInitialBlockNumber } from '@pancakeswap/wagmi'
import { useEffect, useMemo, useState } from 'react'

export enum SubgraphStatus {
  OK,
  WARNING,
  NOT_OK,
  UNKNOWN,
  DOWN,
}

export type SubgraphHealthState = {
  status: SubgraphStatus
  chainId: number
  subgraph: string
  currentBlock: number
  chainHeadBlock: number
  latestBlock: number
  blockDifference: number
}

const NOT_OK_BLOCK_DIFFERENCE = 200 // ~15 minutes delay
const WARNING_BLOCK_DIFFERENCE = 50 // ~2.5 minute delay

const useSubgraphHealth = ({ chainId, subgraph }: { chainId: ChainId; subgraph?: string }) => {
  const { data: initialBlockBN = 0 } = useInitialBlockNumber({
    chainId,
  })

  const initialBlock = useMemo(() => Number(initialBlockBN), [initialBlockBN])

  const [deploymentId, setDeploymentId] = useState<string | undefined>()

  useEffect(() => {
    let unmounted = false
    const unmount = () => {
      unmounted = true
    }
    if (!subgraph) {
      return unmount
    }

    const fetchDeploymentId = async () => {
      const {
        _meta: { deployment },
      } = await request(
        subgraph,
        gql`
          query MyQuery {
            _meta {
              deployment
            }
          }
        `,
      )

      if (unmounted) {
        return
      }
      setDeploymentId(deployment)
    }

    fetchDeploymentId()
    return unmount
  }, [subgraph])

  const { data: currentBlockNumber = 0 } = useQuery<number>({
    queryKey: [SLOW_INTERVAL, 'blockNumber', chainId],
    enabled: false,
  })

  const { data: sgHealth } = useQuery<SubgraphHealthState>({
    queryKey: ['sgHealth', chainId, subgraph, deploymentId, currentBlockNumber || initialBlock],
    placeholderData: (prev) => {
      if (!prev || prev.chainId !== chainId || prev.subgraph !== subgraph) {
        return {
          status: SubgraphStatus.UNKNOWN,
          currentBlock: 0,
          chainHeadBlock: 0,
          latestBlock: 0,
          blockDifference: 0,
          chainId: chainId!,
          subgraph: subgraph!,
        }
      }
      return prev
    },
    gcTime: SLOW_INTERVAL,
    queryFn: async () => {
      try {
        const [{ indexingStatuses }, currentBlock] = await Promise.all([
          request(
            GRAPH_HEALTH,
            gql`query getSubgraphHealth {
              indexingStatuses(
                subgraphs: ["${deploymentId}"]
              ) {
                subgraph
                synced
                health
                entityCount
                fatalError {
                  handler
                  message
                  deterministic
                  block {
                    hash
                    number
                  }
                }
                nonFatalErrors{
                  message
                  block{number}
                }
                chains {
                  chainHeadBlock {
                    number
                  }
                  earliestBlock {
                    number
                  }
                  latestBlock {
                    number
                  }
                }
              }
            }
          `,
          ),
          currentBlockNumber ? Promise.resolve(currentBlockNumber) : Promise.resolve(initialBlock),
        ])

        const [indexingStatusForCurrentVersion] = indexingStatuses

        const isHealthy = indexingStatusForCurrentVersion?.health === 'healthy'
        const chainHeadBlock = parseInt(indexingStatusForCurrentVersion?.chains[0]?.chainHeadBlock.number)
        const latestBlock = parseInt(indexingStatusForCurrentVersion?.chains[0]?.latestBlock.number)
        const blockDifference = currentBlock - latestBlock
        // Sometimes subgraph might report old block as chainHeadBlock, so it's important to compare
        // it with block retrieved from simpleRpcProvider.getBlockNumber()
        const chainHeadBlockDifference = currentBlock - chainHeadBlock
        const sgHealthData = {
          currentBlock,
          chainHeadBlock,
          latestBlock,
          blockDifference,
          chainId: chainId!,
          subgraph: subgraph!,
        }
        if (
          !isHealthy ||
          blockDifference > NOT_OK_BLOCK_DIFFERENCE ||
          chainHeadBlockDifference > NOT_OK_BLOCK_DIFFERENCE
        ) {
          return {
            status: SubgraphStatus.NOT_OK,
            ...sgHealthData,
          }
        }
        if (blockDifference > WARNING_BLOCK_DIFFERENCE || chainHeadBlockDifference > WARNING_BLOCK_DIFFERENCE) {
          return {
            status: SubgraphStatus.WARNING,
            ...sgHealthData,
          }
        }
        return {
          status: SubgraphStatus.OK,
          ...sgHealthData,
        }
      } catch (error) {
        console.error(`Failed to perform health check for ${subgraph} subgraph`, error)
        return {
          status: SubgraphStatus.DOWN,
          currentBlock: -1,
          chainHeadBlock: 0,
          latestBlock: -1,
          blockDifference: 0,
          chainId: chainId!,
          subgraph: subgraph!,
        }
      }
    },
    enabled: Boolean(initialBlock && chainId && subgraph && deploymentId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return sgHealth!
}

export default useSubgraphHealth
