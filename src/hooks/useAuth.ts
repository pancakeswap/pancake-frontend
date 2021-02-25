import { useWeb3React } from '@web3-react/core'
import { useToast } from 'state/hooks'
import { connectorsByName } from 'utils/web3React'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const { toastError } = useToast()

  const login = (conectorID) => {
    const connector = connectorsByName[conectorID]
    if (connector) {
      activate(connector, (error: Error) => toastError(error.name, error.message))
    } else {
      toastError("Can't find connector", 'The connector config is wriong')
    }
  }

  return { login, logout: deactivate }
}

export default useAuth
