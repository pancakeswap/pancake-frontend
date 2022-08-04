import { useClient, useConnect } from 'wagmi'
import { useEffect } from 'react'

const AUTOCONNECTED_CONNECTOR_IDS = ['safe']

const useEagerConnect = () => {
  const client = useClient()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
      const connectorInstance = connectors.find((c) => c.id === connector && c.ready)

      if (connectorInstance) {
        connect({ connector: connectorInstance })
      } else {
        client.autoConnect()
      }
    })
  }, [client, connect, connectors])
}

export default useEagerConnect
