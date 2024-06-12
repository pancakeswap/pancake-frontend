import { THE_GRAPH_PROXY_API, V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSubgraphHealth, { SubgraphStatus } from 'hooks/useSubgraphHealth'

const useShowWarningMessage = () => {
  const { chainId } = useActiveChainId()
  const subgraphName = chainId ? V3_SUBGRAPH_URLS[chainId]?.replace(`${THE_GRAPH_PROXY_API}/`, '') || '' : ''
  const { status } = useSubgraphHealth({ chainId, subgraphName })

  return status === SubgraphStatus.DOWN
}

export default useShowWarningMessage
