import { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import useActiveWeb3React from './useActiveWeb3React'

export function useSwitchNetwork() {
  const { data: __isLoading, mutate: setLoading } = useSWRImmutable('switch-network-loading', { fallbackData: false })
  const { mutate } = useSWRConfig()
  const { switchNetworkAsync, isLoading: _isLoading, ...switchNetworkArgs } = useSwitchNetworkWallet()
  const { account } = useActiveWeb3React()

  const switchNetwork = useCallback(
    (chainId: number) => {
      setLoading(true)
      if (account && typeof switchNetworkAsync === 'function') {
        return switchNetworkAsync(chainId)
          .then((c) => {
            if (c) {
              mutate('session-chain-id', c.id)
            }
          })
          .finally(() => setLoading(false))
      }
      return mutate('session-chain-id', chainId).finally(() => setLoading(false))
    },
    [account, mutate, setLoading, switchNetworkAsync],
  )

  const isLoading = _isLoading || __isLoading

  return {
    ...switchNetworkArgs,
    switchNetwork,
    isLoading,
  }
}
