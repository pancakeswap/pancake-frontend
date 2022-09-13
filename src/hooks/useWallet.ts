import { useTranslation } from '@pancakeswap/localization'
import { useWalletModal } from '@pancakeswap/uikit'
import { ConnectorNames, wallets } from 'config/wallet'
import { useMemo } from 'react'
import { useConnect } from 'wagmi'
import useAuth from './useAuth'

export const useWallet = () => {
  const { t } = useTranslation()
  const { connectors } = useConnect()
  const { login } = useAuth()

  const finalWallets = useMemo(() => {
    return wallets.map((config) => {
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

  const { onPresentConnectModal } = useWalletModal(login, t, finalWallets)

  return { onPresentConnectModal }
}
