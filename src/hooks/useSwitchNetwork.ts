import { useCallback } from 'react'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const [, setSessionChainId] = useSessionChainId()
  const { switchNetworkAsync, isLoading: _isLoading, ...switchNetworkArgs } = useSwitchNetworkWallet()
  const { isConnected } = useAccount()

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof switchNetworkAsync === 'function') {
        setLoading(true)
        return switchNetworkAsync(chainId)
          .then((c) => {
            replaceBrowserHistory('chainId', c?.id ?? chainId)
            setSessionChainId(c?.id ?? chainId)
          })
          .finally(() => setTimeout(() => setLoading(false), 1000))
      }
      return new Promise(() => {
        setSessionChainId(chainId)
      })
    },
    [isConnected, setLoading, setSessionChainId, switchNetworkAsync],
  )

  const isLoading = _isLoading || loading

  return {
    ...switchNetworkArgs,
    switchNetwork,
    isLoading,
  }
}
