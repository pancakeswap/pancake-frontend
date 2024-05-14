import { watchAccount } from '@wagmi/core'
import { useCallback, useEffect } from 'react'
import { useAccount, useAccountEffect, useConfig } from 'wagmi'
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
  const { chainId } = useAccount()

  useEffect(() => {
    return watchAccount(config, {
      onChange(data, prevData) {
        if (prevData.status === 'connected' && data.status === 'connected' && prevData.chainId === data.chainId) {
          // clearUserStates(dispatch, { chainId })
        }
      },
    })
  }, [config, chainId])
}

export const useAccountEventListener = () => {
  useChainIdListener()
  useAddressListener()

  useAccountEffect({
    onDisconnect() {
      // clearUserStates(dispatch, { chainId })
    },
  })
}
