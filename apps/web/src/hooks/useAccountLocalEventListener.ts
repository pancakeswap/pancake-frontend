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
        if (chainId) {
          dispatch(resetUserState({ chainId }))
        }
      }

      connector.emitter.on('disconnect', handleEvent)
      connector.emitter.on('change', handleEvent)

      return () => {
        connector.emitter.off('disconnect', handleEvent)
        connector.emitter.off('change', handleEvent)
      }
    }
    return undefined
  }, [account, chainId, dispatch, connector])
}
