import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSubgraphHealth, { SubgraphStatus } from 'hooks/useSubgraphHealth'
import { useMemo } from 'react'

const useShowWarningMessage = () => {
  const { chainId } = useActiveChainId()
  const subgraphName = chainId
    ? V3_SUBGRAPH_URLS[chainId]?.replace('https://api.thegraph.com/subgraphs/name/', '') || ''
    : ''
  const { status } = useSubgraphHealth({ chainId, subgraphName })

  return status === SubgraphStatus.DOWN
}

export default useShowWarningMessage
