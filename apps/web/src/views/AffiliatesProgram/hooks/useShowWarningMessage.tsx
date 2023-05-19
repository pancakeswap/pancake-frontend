import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import useSubgraphHealth, { SubgraphStatus } from 'hooks/useSubgraphHealth'

const useShowWarningMessage = () => {
  const { chainId } = useActiveChainId()
  const subgraphName = V3_SUBGRAPH_URLS[chainId]?.replace('https://api.thegraph.com/subgraphs/name/', '') || ''
  const { status } = useSubgraphHealth(subgraphName)

  return useMemo(() => {
    if (status === SubgraphStatus.DOWN) {
      return true
    }
    return false
  }, [status])
}

export default useShowWarningMessage
