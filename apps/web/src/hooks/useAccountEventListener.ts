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

const useAddressListener = () => {
  const { connector, chainId } = useAccount()
  const dispatch = useAppDispatch()

  const onAddressChanged = useCallback(
    ({ accounts }: { accounts?: any }) => {
      if (accounts.length > 0) {
        clearUserStates(dispatch, { chainId })
      }
    },
    [chainId, dispatch],
  )

  useEffect(() => {
    connector?.emitter?.on('change', onAddressChanged)

    return () => {
      connector?.emitter?.off('change', onAddressChanged)
    }
  })
}

export const useAccountEventListener = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()
  useChainIdListener()
  useAddressListener()

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
