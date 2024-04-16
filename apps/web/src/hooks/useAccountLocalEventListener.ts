import { useAccountEffect } from 'wagmi'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
import { resetUserState } from '../state/global/actions'
import useActiveWeb3React from './useActiveWeb3React'

export const useAccountLocalEventListener = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useLocalDispatch()

  useAccountEffect({
    onDisconnect() {
      if (chainId) {
        dispatch(resetUserState({ chainId }))
      }
    },
  })
}
