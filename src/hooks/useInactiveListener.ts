import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'

export const useInactiveListener = () => {
  const { account, chainId, connector } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleDeactivate = () => {
        clearUserStates(dispatch, chainId)
      }

      connector.addListener('Web3ReactDeactivate', handleDeactivate)

      return () => {
        connector.removeListener('Web3ReactDeactivate', handleDeactivate)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
