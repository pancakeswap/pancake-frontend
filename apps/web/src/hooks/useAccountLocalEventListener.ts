import { useAccountEffect } from 'wagmi'
import { resetUserState } from 'state/global/actions'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
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
