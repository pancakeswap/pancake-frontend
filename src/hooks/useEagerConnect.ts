import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from 'greenteaswap-ui-kit'
import useAuth from 'hooks/useAuth'

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames
    if (connectorId) {
      login(connectorId)
    }
  }, [login])
}

export default useEagerConnect
