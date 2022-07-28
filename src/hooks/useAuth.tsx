import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useConnect, useDisconnect, useNetwork } from 'wagmi'
import { clearUserStates } from '../utils/clearUserStates'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { connectAsync, connectors } = useConnect()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  // const { toastError } = useToast()

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorID)
      try {
        await connectAsync({ connector: findConnector })
      } catch (error) {
        console.error(error)
        window?.localStorage?.removeItem(connectorLocalStorageKey)
        // toastError()
      }
    },
    [connectors, connectAsync],
  )

  const logout = useCallback(() => {
    disconnect()
    clearUserStates(dispatch, chain?.id, true)
  }, [disconnect, dispatch, chain?.id])

  return { login, logout }
}

export default useAuth
