import { useState } from 'react'
import { request, gql } from 'graphql-request'
import { simpleRpcProvider } from 'utils/providers'
import { GRAPH_HEALTH } from 'config/constants/endpoints'
import { useSlowRefreshEffect } from './useRefreshEffect'

export enum SubgraphStatus {
  OK,
  WARNING,
  NOT_OK,
  UNKNOWN,
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

const useSubgraphHealth = (subgraphName: string) => {
  const [sgHealth, setSgHealth] = useState<SubgraphHealthState>({
    status: SubgraphStatus.UNKNOWN,
    currentBlock: 0,
    chainHeadBlock: 0,
    latestBlock: 0,
    blockDifference: 0,
  })

  useSlowRefreshEffect(
    (currentBlockNumber) => {
      const getSubgraphHealth = async () => {
        try {
          const { indexingStatusForCurrentVersion } = await request(
            GRAPH_HEALTH,
            gql`
            query getNftMarketSubgraphHealth {
              indexingStatusForCurrentVersion(subgraphName: "${subgraphName}") {
                synced
                health
                chains {
                  chainHeadBlock {
                    number
                  }
                  latestBlock {
                    number
                  }
                }
              }
            }
          `,
          )

          const currentBlock = currentBlockNumber || (await simpleRpcProvider.getBlockNumber())
          const isHealthy = indexingStatusForCurrentVersion.health === 'healthy'
          const chainHeadBlock = parseInt(indexingStatusForCurrentVersion.chains[0].chainHeadBlock.number)
          const latestBlock = parseInt(indexingStatusForCurrentVersion.chains[0].latestBlock.number)
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
          console.error(`Failed to perform health check for ${subgraphName} subgraph`, error)
        }
      }
      getSubgraphHealth()
    },
    [subgraphName],
  )

  return sgHealth
}

export default useSubgraphHealth
