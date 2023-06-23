import { useEffect, useMemo } from 'react'
import { ExtendEthereum } from 'global'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { ConnectorData, useAccount } from 'wagmi'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import { useSessionChainId } from './useSessionChainId'
import { useActiveChainId } from './useActiveChainId'

export const useAccountEventListener = () => {
  // const { account, chainId, connector } = useActiveWeb3React()
  const { chainId } = useActiveChainId()
  const { connector, address } = useAccount()
  const [, setSessionChainId] = useSessionChainId()
  const dispatch = useAppDispatch()

  const isBloctoMobileApp = useMemo(() => {
    return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
  }, [])

  useEffect(() => {
    if (address && connector) {
      const handleUpdateEvent = (e: ConnectorData) => {
        if (e?.chain?.id && !(e?.chain?.unsupported ?? false)) {
          replaceBrowserHistory('chain', CHAIN_QUERY_NAME[e.chain.id])
          setSessionChainId(e.chain.id)
        }
        // Blocto in-app browser throws change event when no account change which causes user state reset therefore
        // this event should not be handled to avoid unexpected behaviour.
        if (!isBloctoMobileApp) {
          clearUserStates(dispatch, { chainId, newChainId: e?.chain?.id })
        }
      }

      const handleDeactiveEvent = () => {
        clearUserStates(dispatch, { chainId })
      }

      connector.addListener('disconnect', handleDeactiveEvent)
      connector.addListener('change', handleUpdateEvent)

      return () => {
        connector.removeListener('disconnect', handleDeactiveEvent)
        connector.removeListener('change', handleUpdateEvent)
      }
    }
    return undefined
  }, [chainId, dispatch, address, connector, setSessionChainId, isBloctoMobileApp])
}
