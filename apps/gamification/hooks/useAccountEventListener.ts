import { watchAccount } from '@wagmi/core'
import { useSwitchNetworkLocal } from 'hooks/useSwitchNetwork'
import { useCallback, useEffect } from 'react'
import { useAppDispatch } from 'state'
import { clearUserStates } from 'utils/clearUserStates'
import { useAccount, useAccountEffect, useConfig } from 'wagmi'

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
  const dispatch = useAppDispatch()

  useEffect(() => {
    return watchAccount(config as any, {
      onChange(data, prevData) {
        if (prevData.status === 'connected' && data.status === 'connected' && prevData.chainId === data.chainId) {
          clearUserStates(dispatch, { chainId })
        }
      },
    })
  }, [config, chainId, dispatch])
}

export const useAccountEventListener = () => {
  useChainIdListener()
  useAddressListener()
  const { chainId } = useAccount()
  const dispatch = useAppDispatch()

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
