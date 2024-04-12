import { useTranslation } from '@pancakeswap/localization'
import { WalletConnectorNotFoundError, WalletSwitchChainError } from '@pancakeswap/ui-wallets'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { ConnectorNames } from 'config/wallet'
import { useCallback } from 'react'
import { ConnectorNotFoundError, SwitchChainNotSupportedError, useConnect, useDisconnect } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'
import { useSessionChainId } from './useSessionChainId'

const useAuth = () => {
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { chainId } = useActiveChainId()
  const [, setSessionChainId] = useSessionChainId()
  const { t } = useTranslation()

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorID)
      try {
        const connected = await connectAsync({ connector: findConnector, chainId })
        if (!connected.chain.unsupported && connected.chain.id !== chainId) {
          replaceBrowserHistory('chain', CHAIN_QUERY_NAME[connected.chain.id])
          setSessionChainId(connected.chain.id)
        }
        return connected
      } catch (error) {
        if (error instanceof ConnectorNotFoundError) {
          throw new WalletConnectorNotFoundError()
        }
        if (
          error instanceof SwitchChainNotSupportedError
          // TODO: wagmi
          // || error instanceof SwitchChainError
        ) {
          throw new WalletSwitchChainError(t('Unable to switch network. Please try it on your wallet'))
        }
      }
      return undefined
    },
    [connectors, connectAsync, chainId, setSessionChainId, t],
  )

  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    }
  }, [disconnectAsync])

  return { login, logout }
}

export default useAuth
