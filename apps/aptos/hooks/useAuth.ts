import { useConnect, useDisconnect } from '@pancakeswap/awgmi'
import { ConnectorNames } from 'config/wallets'

export function useAuth() {
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const login = async (connectorId: ConnectorNames) => {
    const findConnector = connectors.find((c) => c.id === connectorId)
    try {
      await connectAsync({ connector: findConnector })
    } catch (error) {
      console.error(error)
      // TODO: error handling
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
