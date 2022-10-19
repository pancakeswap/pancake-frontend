import { useConnect, useDisconnect } from '@pancakeswap/awgmi'
import { ConnectorNotFoundError } from '@pancakeswap/awgmi/core'
import { WalletConnectorNotFoundError } from '@pancakeswap/ui-wallets'
import { ConnectorNames } from 'config/wallets'

export function useAuth() {
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const login = async (connectorId: ConnectorNames) => {
    const findConnector = connectors.find((c) => c.id === connectorId)
    if (!findConnector) {
      throw new WalletConnectorNotFoundError()
    }
    try {
      await connectAsync({ connector: findConnector })
    } catch (error) {
      if (error instanceof ConnectorNotFoundError) {
        throw new WalletConnectorNotFoundError()
      }
    }
  }

  const logout = async () => {
    return disconnectAsync()
  }

  return {
    login,
    logout,
  }
}
