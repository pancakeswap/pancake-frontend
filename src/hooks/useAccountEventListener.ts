import { useEffect } from 'react'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import useActiveWeb3React from './useActiveWeb3React'

export const useAccountEventListener = () => {
  const { account, chainId, connector } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleUpdateEvent = () => {
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
  }, [account, chainId, dispatch, connector])
}
