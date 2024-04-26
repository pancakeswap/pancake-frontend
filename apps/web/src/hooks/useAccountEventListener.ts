import { useCallback, useEffect } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import { useSwitchNetworkLocal } from './useSwitchNetwork'

export const useChainIdListener = () => {
  const switchNetworkCallback = useSwitchNetworkLocal()
  const onChainChanged = useCallback(
    ({ chainId }: { chainId?: number }) => {
      if (chainId === undefined) return
      switchNetworkCallback(chainId)
    },
    [switchNetworkCallback],
  )
  const { connector } = useAccount()

  useEffect(() => {
    connector?.emitter?.on('change', onChainChanged)

    return () => {
      connector?.emitter?.off('change', onChainChanged)
    }
  })
}

export const useAccountEventListener = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()
  useChainIdListener()

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
