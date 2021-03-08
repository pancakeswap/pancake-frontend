import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ConnectorNames } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import { connectorsByName } from 'utils/web3React'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, (error: Error) => toastError(error.name, error.message))
    } else {
      toastError("Can't find connector", 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { login, logout: deactivate }
}

export default useAuth
