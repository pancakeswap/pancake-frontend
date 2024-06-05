import { watchAccount } from '@wagmi/core'
import { useCallback, useEffect } from 'react'
import { useAppDispatch } from 'state'
import { clearUserStates } from 'utils/clearUserStates'
import { Address, isAddressEqual } from 'viem'
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
    onConnect(data) {
      const { address } = data
      if (!address) return
      const whiteListedAddresses = (process.env.NEXT_PUBLIC_X_WHITELISTED_ADDRESSES?.split(',') ?? []) as Address[]
      if (
        whiteListedAddresses.length === 0 ||
        !whiteListedAddresses.some((whiteListedAddress) => isAddressEqual(address, whiteListedAddress))
      ) {
        window.location.replace('https://pancakeswap.finance')
      }
    },
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
