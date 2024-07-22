import { useAccountEffect } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useLocalDispatch from '../contexts/LocalRedux/useLocalDispatch'
import { resetUserState } from '../state/global/actions'

export const useAccountLocalEventListener = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useLocalDispatch()

  useAccountEffect({
    onDisconnect() {
      if (chainId) {
        dispatch(resetUserState({ chainId }))
      }
    },
  })
}
