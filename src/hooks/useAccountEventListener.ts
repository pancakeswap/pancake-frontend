import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'

export const useAccountEventListener = () => {
  const { account, chainId, connector } = useWeb3React()
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
