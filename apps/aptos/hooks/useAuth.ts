import { useCallback } from 'react'
import { useConnect, useDisconnect } from '@pancakeswap/awgmi'
import { ConnectorNotFoundError } from '@pancakeswap/awgmi/core'
import { WalletConnectorNotFoundError } from '@pancakeswap/ui-wallets'
import { ConnectorNames } from 'config/wallets'
import { useActiveNetwork } from './useNetwork'

export function useAuth() {
  const network = useActiveNetwork()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const login = useCallback(
    // eslint-disable-next-line consistent-return
    async (connectorId: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorId)
      if (!findConnector) {
        throw new WalletConnectorNotFoundError()
      }
      try {
        const connected = await connectAsync({ connector: findConnector, networkName: network.networkName })
        return connected
      } catch (error) {
        if (error instanceof ConnectorNotFoundError) {
          throw new WalletConnectorNotFoundError()
        }
      }
    },
    [network.networkName, connectAsync, connectors],
  )

  const logout = useCallback(async () => {
    return disconnectAsync()
  }, [disconnectAsync])

  return {
    login,
    logout,
  }
}
