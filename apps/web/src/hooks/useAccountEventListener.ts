import { useCallback, useEffect } from 'react'
import { watchAccount } from '@wagmi/core'
import { useAccount, useAccountEffect, useConfig } from 'wagmi'
import { useAppDispatch } from 'state'
import { clearUserStates } from 'utils/clearUserStates'
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
  const config = useConfig()
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()

  useEffect(() => {
    return watchAccount(config, {
      onChange(data, prevData) {
        if (prevData.status === 'connected' && data.status === 'connected' && prevData.chainId === data.chainId) {
          clearUserStates(dispatch, { chainId })
        }
      },
    })
  }, [config, dispatch, chainId])
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
