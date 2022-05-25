import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
import { resetUserState } from '../state/global/actions'

export const useAccountLocalEventListener = () => {
  const { account, chainId, connector } = useWeb3React()
  const dispatch = useLocalDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleEvent = () => {
        dispatch(resetUserState({ chainId }))
      }

      connector.addListener('Web3ReactDeactivate', handleEvent)
      connector.addListener('Web3ReactUpdate', handleEvent)

      return () => {
        connector.removeListener('Web3ReactDeactivate', handleEvent)
        connector.removeListener('Web3ReactUpdate', handleEvent)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
