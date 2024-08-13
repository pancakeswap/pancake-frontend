import { V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSubgraphHealth from 'hooks/useSubgraphHealth'
import { ApiStatus } from 'hooks/types'

const useShowWarningMessage = () => {
  const { chainId } = useActiveChainId()
  const subgraph = chainId ? V3_SUBGRAPH_URLS[chainId] || '' : ''
  const { status } = useSubgraphHealth({ chainId, subgraph })

  return status === ApiStatus.DOWN
}

export default useShowWarningMessage
