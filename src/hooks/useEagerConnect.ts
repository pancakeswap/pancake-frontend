import { useClient, useConnect } from 'wagmi'
import { useEffect } from 'react'

const SAFE_ID = 'safe'

const useEagerConnect = () => {
  const client = useClient()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    const connectorInstance = connectors.find((c) => c.id === SAFE_ID && c.ready)
    if (
      connectorInstance &&
      // @ts-ignore
      !window.cy
    ) {
      console.log('here????')
      connectAsync({ connector: connectorInstance }).catch(() => {
        console.log('or here????')
        client.autoConnect()
      })
    } else {
      const bsc = connectors.find((c) => c.id === 'bsc')
      console.log('or or here????', bsc)
      client.autoConnect()
    }
  }, [client, connectAsync, connectors])
}

export default useEagerConnect
