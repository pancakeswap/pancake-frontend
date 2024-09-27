import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { ExtendEthereum } from 'global'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { clearUserStates } from 'utils/clearUserStates'
import { useAccount, useSwitchChain } from 'wagmi'
import { useAtom } from 'jotai/index'
import { queryChainIdAtom } from 'hooks/useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetworkLocal() {
  const [, setQueryChainId] = useAtom(queryChainIdAtom)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const isBloctoMobileApp = useMemo(() => {
    return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
  }, [])

  return useCallback(
    (chainId: number) => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            chain: CHAIN_QUERY_NAME[chainId],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
      setQueryChainId(chainId)
      // Blocto in-app browser throws change event when no account change which causes user state reset therefore
      // this event should not be handled to avoid unexpected behaviour.
      if (!isBloctoMobileApp) {
        clearUserStates(dispatch, { chainId, newChainId: chainId })
      }
    },
    [dispatch, isBloctoMobileApp, setQueryChainId, router],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    status,
    switchChainAsync: _switchNetworkAsync,
    switchChain: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchChain()

  const _isLoading = status === 'pending'

  const { t } = useTranslation()

  const { toastError } = useToast()
  const { isConnected } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()

  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && typeof _switchNetworkAsync === 'function') {
        if (isLoading) return undefined
        setLoading(true)
        return _switchNetworkAsync({ chainId })
          .then((c) => {
            switchNetworkLocal(chainId)
            // well token pocket
            if (window.ethereum?.isTokenPocket === true) {
              window.location.reload()
            }
            return c
          })
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
    [isConnected, _switchNetworkAsync, isLoading, setLoading, switchNetworkLocal, toastError, t],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork({ chainId })
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            window.ethereum?.isMathWallet
          )
        : true,
    [_switchNetworkAsync, isConnected],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
