import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { ConnectorNames } from 'config/wallet'
import { useAccount, useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetworkLocal() {
  const [, setSessionChainId] = useSessionChainId()
  return useCallback(
    (chainId: number) => {
      setSessionChainId(chainId)
      replaceBrowserHistory('chainId', chainId === ChainId.BSC ? null : chainId)
    },
    [setSessionChainId],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    switchNetworkAsync: _switchNetworkAsync,
    isLoading: _isLoading,
    switchNetwork: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchNetworkWallet()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { isConnected, connector } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && typeof _switchNetworkAsync === 'function') {
        setLoading(true)
        return _switchNetworkAsync(chainId)
          .catch(() => {
            // TODO: review the error
            toastError(t('Error connecting, please retry and confirm in wallet!'))
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {
        switchNetworkLocal(chainId)
      })
    },
    [isConnected, _switchNetworkAsync, t, setLoading, toastError, switchNetworkLocal],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork(chainId)
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  const isLoading = _isLoading || loading
  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          connector.id !== ConnectorNames.WalletConnect &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            window.ethereum?.isSafePal
          )
        : true,
    [_switchNetworkAsync, isConnected, connector],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
