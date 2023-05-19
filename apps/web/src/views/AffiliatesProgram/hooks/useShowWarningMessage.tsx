import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import useSubgraphHealth, { SubgraphStatus } from 'hooks/useSubgraphHealth'

const useShowWarningMessage = () => {
  const subgraphName = V3_SUBGRAPH_URLS[ChainId.BSC]?.replace('https://api.thegraph.com/subgraphs/name/', '') || ''
  const { status } = useSubgraphHealth(subgraphName)

  return useMemo(() => {
    if (status === SubgraphStatus.DOWN) {
      return true
    }
    return false
  }, [status])
}

export default useShowWarningMessage
