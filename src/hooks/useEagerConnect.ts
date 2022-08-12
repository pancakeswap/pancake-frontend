import { useClient, useConnect } from 'wagmi'
import { useEffect } from 'react'

const AUTOCONNECTED_CONNECTOR_IDS = ['safe']

const useEagerConnect = () => {
  const client = useClient()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
      const connectorInstance = connectors.find((c) => c.id === connector && c.ready)
      if (connectorInstance) {
        connectAsync({ connector: connectorInstance }).catch(() => {
          client.autoConnect()
        })
      } else {
        client.autoConnect()
      }
    })
  }, [client, connectAsync, connectors])
}

export default useEagerConnect
