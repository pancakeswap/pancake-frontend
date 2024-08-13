import { useEffect, useState } from 'react'
import { request, gql } from 'graphql-request'
import { GRAPH_HEALTH } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSlowRefreshEffect } from './useRefreshEffect'

export enum SubgraphStatus {
  OK,
  WARNING,
  NOT_OK,
  UNKNOWN,
  DOWN,
}

export type SubgraphHealthState = {
  status: SubgraphStatus
  currentBlock: number
  chainHeadBlock: number
  latestBlock: number
  blockDifference: number
}

const NOT_OK_BLOCK_DIFFERENCE = 200 // ~15 minutes delay
const WARNING_BLOCK_DIFFERENCE = 50 // ~2.5 minute delay

const useSubgraphHealth = ({ chainId: propChainId, subgraph }: { chainId: ChainId; subgraph?: string }) => {
  const { chainId } = useActiveChainId()
  const [sgHealth, setSgHealth] = useState<SubgraphHealthState>({
    status: SubgraphStatus.UNKNOWN,
    currentBlock: 0,
    chainHeadBlock: 0,
    latestBlock: 0,
    blockDifference: 0,
  })
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

  useSlowRefreshEffect(
    (currentBlockNumber) => {
      if (!deploymentId) {
        return
      }
      const getSubgraphHealth = async () => {
        try {
          const [{ indexingStatuses }, currentBlock] = await Promise.all([
            request(
              GRAPH_HEALTH,
              gql`
            query getSubgraphHealth {
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
            currentBlockNumber && propChainId === chainId
              ? Promise.resolve(currentBlockNumber)
              : publicClient({ chainId: propChainId })
                  ?.getBlockNumber()
                  .then((blockNumber) => Number(blockNumber)),
          ])

          const [indexingStatusForCurrentVersion] = indexingStatuses

          const isHealthy = indexingStatusForCurrentVersion?.health === 'healthy'
          const chainHeadBlock = parseInt(indexingStatusForCurrentVersion?.chains[0]?.chainHeadBlock.number)
          const latestBlock = parseInt(indexingStatusForCurrentVersion?.chains[0]?.latestBlock.number)
          const blockDifference = currentBlock - latestBlock
          // Sometimes subgraph might report old block as chainHeadBlock, so its important to compare
          // it with block retrieved from simpleRpcProvider.getBlockNumber()
          const chainHeadBlockDifference = currentBlock - chainHeadBlock
          if (
            !isHealthy ||
            blockDifference > NOT_OK_BLOCK_DIFFERENCE ||
            chainHeadBlockDifference > NOT_OK_BLOCK_DIFFERENCE
          ) {
            setSgHealth({ status: SubgraphStatus.NOT_OK, currentBlock, chainHeadBlock, latestBlock, blockDifference })
          } else if (
            blockDifference > WARNING_BLOCK_DIFFERENCE ||
            chainHeadBlockDifference > WARNING_BLOCK_DIFFERENCE
          ) {
            setSgHealth({ status: SubgraphStatus.WARNING, currentBlock, chainHeadBlock, latestBlock, blockDifference })
          } else {
            setSgHealth({ status: SubgraphStatus.OK, currentBlock, chainHeadBlock, latestBlock, blockDifference })
          }
        } catch (error) {
          console.error(`Failed to perform health check for ${subgraph}(deployment: ${deploymentId}) subgraph`, error)
          setSgHealth({
            status: SubgraphStatus.DOWN,
            currentBlock: -1,
            chainHeadBlock: 0,
            latestBlock: -1,
            blockDifference: 0,
          })
        }
      }
      if (deploymentId) {
        getSubgraphHealth()
      }
    },
    [subgraph, deploymentId, propChainId, chainId],
  )

  return sgHealth
}

export default useSubgraphHealth
