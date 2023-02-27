import { useEffect } from 'react'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
import { resetUserState } from '../state/global/actions'
import useActiveWeb3React from './useActiveWeb3React'

export const useAccountLocalEventListener = () => {
  const { account, chainId, connector } = useActiveWeb3React()
  const dispatch = useLocalDispatch()

  useEffect(() => {
    if (account && connector) {
      const handleEvent = () => {
        dispatch(resetUserState({ chainId }))
      }

      connector.addListener('disconnect', handleEvent)
      connector.addListener('change', handleEvent)

      return () => {
        connector.removeListener('disconnect', handleEvent)
        connector.removeListener('change', handleEvent)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
