import { useAccount, useAccountEffect } from 'wagmi'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'

export const useAccountEventListener = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
