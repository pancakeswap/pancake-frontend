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

      connector.addListener('Web3ReactDeactivate', handleDeactiveEvent)
      connector.addListener('Web3ReactUpdate', handleUpdateEvent)

      return () => {
        connector.removeListener('Web3ReactDeactivate', handleDeactiveEvent)
        connector.removeListener('Web3ReactUpdate', handleUpdateEvent)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
