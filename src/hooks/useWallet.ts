import { useTranslation } from '@pancakeswap/localization'
import { ConnectorNames, useWalletModal, walletConnectors } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useConnect } from 'wagmi'
import useAuth from './useAuth'

export const useWallet = () => {
  const { t } = useTranslation()
  const { connectors } = useConnect()
  const { login } = useAuth()

  const finalConnectors = useMemo(() => {
    return walletConnectors.map((config) => {
      const found = connectors.find((c) => c.id === config.connectorId)
      if (!(config.installed || found.ready)) {
        if (config.connectorId === ConnectorNames.MetaMask) {
          return {
            ...config,
            connectorId: ConnectorNames.Injected,
          }
        }
        return {
          ...config,
          priority: 999,
        }
      }
      return config
    })
  }, [connectors])

  const { onPresentConnectModal } = useWalletModal(login, t, finalConnectors)

  return { onPresentConnectModal }
}
