import { useConnect, useDisconnect } from '@pancakeswap/awgmi'
import { ConnectorNotFoundError } from '@pancakeswap/awgmi/core'
import { WalletConnectorNotFoundError } from '@pancakeswap/ui-wallets'
import { ConnectorNames } from 'config/wallets'
import { useActiveNetwork } from './useNetwork'

export function useAuth() {
  const network = useActiveNetwork()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  // eslint-disable-next-line consistent-return
  const login = async (connectorId: ConnectorNames) => {
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
  }

  const logout = async () => {
    return disconnectAsync()
  }

  return {
    login,
    logout,
  }
}
