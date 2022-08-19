import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'

export const switchNetworkLoadingAtom = atom(false)

export function useSwitchNetwork() {
  const [loading, setLoading] = useAtom(switchNetworkLoadingAtom)
  const { mutate } = useSWRConfig()
  const { switchNetworkAsync, isLoading: _isLoading, ...switchNetworkArgs } = useSwitchNetworkWallet()
  const { isConnected } = useAccount()

  const switchNetwork = useCallback(
    (chainId: number) => {
      setLoading(true)
      if (isConnected && typeof switchNetworkAsync === 'function') {
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
    [isConnected, mutate, setLoading, switchNetworkAsync],
  )

  const isLoading = _isLoading || loading

  return {
    ...switchNetworkArgs,
    switchNetwork,
    isLoading,
  }
}
