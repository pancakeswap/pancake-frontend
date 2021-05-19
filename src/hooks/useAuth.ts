import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from '@pancakeswap/uikit'
import { connectorsByName } from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { profileClear } from 'state/profile'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork()
          if (hasSetup) {
            activate(connector)
          }
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey)
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
            toastError(t('Provider Error'), t('No provider was found'))
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector
              walletConnector.walletConnectProvider = null
            }
            toastError(t('Authorization Error'), t('Please authorize to access your account'))
          } else {
            toastError(error.name, error.message)
          }
        }
      })
    } else {
      toastError(t('Can’t find connector'), t('The connector config is wrong'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = useCallback(() => {
    dispatch(profileClear())
    deactivate()
  }, [deactivate, dispatch])

  return { login, logout }
}

export default useAuth
