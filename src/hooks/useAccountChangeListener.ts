import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'

export const useAccountChangeListener = () => {
  const { account, chainId, connector } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleUpdate = () => {
        clearUserStates(dispatch, chainId)
      }

      connector.addListener('Web3ReactUpdate', handleUpdate)

      return () => {
        connector.removeListener('Web3ReactUpdate', handleUpdate)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
