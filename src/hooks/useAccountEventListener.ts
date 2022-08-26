import { useEffect } from 'react'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { ConnectorData } from 'wagmi'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import useActiveWeb3React from './useActiveWeb3React'
import { useSessionChainId } from './useSessionChainId'

export const useAccountEventListener = () => {
  const { account, chainId, connector } = useActiveWeb3React()
  const [, setSessionChainId] = useSessionChainId()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleUpdateEvent = (e: ConnectorData<any>) => {
        if (e?.chain?.id && !(e?.chain?.unsupported ?? false)) {
          replaceBrowserHistory('chainId', e.chain.id)
          setSessionChainId(e.chain.id)
        }
        clearUserStates(dispatch, chainId)
      }

      const handleDeactiveEvent = () => {
        clearUserStates(dispatch, chainId, true)
      }

      connector.addListener('disconnect', handleDeactiveEvent)
      connector.addListener('change', handleUpdateEvent)

      return () => {
        connector.removeListener('disconnect', handleDeactiveEvent)
        connector.removeListener('change', handleUpdateEvent)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector, setSessionChainId])
}
