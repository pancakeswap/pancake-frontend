import { Box, connectorLocalStorageKey, ConnectorNames, LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { mutate } from 'swr'
import { useConnect, useDisconnect, useNetwork, ConnectorNotFoundError, UserRejectedRequestError } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { clearUserStates } from '../utils/clearUserStates'
import { useLocalNetworkChain } from './useActiveWeb3React'
import useToast from './useToast'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { connectAsync, connectors } = useConnect()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { toastError } = useToast()
  const localChainId = useLocalNetworkChain()

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorID)
      try {
        const connected = await connectAsync({ connector: findConnector })
        if (connected.chain.id !== localChainId) {
          connected.connector.switchChain?.(localChainId).catch(() => {
            mutate('session-chain-id', connected.chain.id)
          })
        }
      } catch (error) {
        console.error(error)
        window?.localStorage?.removeItem(connectorLocalStorageKey)
        if (error instanceof ConnectorNotFoundError) {
          toastError(
            t('Provider Error'),
            <Box>
              <Text>{t('No provider was found')}</Text>
              <LinkExternal href="https://docs.pancakeswap.finance/get-started/connection-guide">
                {t('Need help ?')}
              </LinkExternal>
            </Box>,
          )
          return
        }
        if (error instanceof UserRejectedRequestError) {
          return
        }
        if (error instanceof Error) {
          toastError(error.message, t('Please authorize to access your account'))
        }
      }
    },
    [connectors, connectAsync, localChainId, toastError, t],
  )

  const logout = useCallback(() => {
    disconnect()
    clearUserStates(dispatch, chain?.id, true)
  }, [disconnect, dispatch, chain?.id])

  return { login, logout }
}

export default useAuth
