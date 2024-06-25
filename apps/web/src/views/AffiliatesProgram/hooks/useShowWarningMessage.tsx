import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSubgraphHealth, { Status } from 'hooks/useSubgraphHealth'

const useShowWarningMessage = () => {
  const { chainId } = useActiveChainId()
  const subgraph = chainId ? V3_SUBGRAPH_URLS[chainId] || '' : ''
  const { status } = useSubgraphHealth({ chainId, subgraph })

  return status === Status.DOWN
}

export default useShowWarningMessage
