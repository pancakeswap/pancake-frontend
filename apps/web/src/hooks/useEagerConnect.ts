import { useClient, useConnect } from 'wagmi'
import { useEffect } from 'react'

const SAFE_ID = 'safe'
const isIframe = (): boolean => {
  // Server-side
  if (typeof window === 'undefined') return false

  // Client-side: test if the app is within the iframe or not
  return window.self !== window.top
}

const iframeConnectors = [SAFE_ID, 'ledgerLive']

const useEagerConnect = () => {
  const client = useClient()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    if (
      isIframe() &&
      // @ts-ignore
      !window.cy
    ) {
      iframeConnectors.forEach((connector) => {
        const connectorInstance = connectors.find((c) => c.id === connector && c.ready)
        connectAsync({ connector: connectorInstance }).catch(() => {
          client.autoConnect()
        })
      })
    } else {
      client.autoConnect()
    }
  }, [client, connectAsync, connectors])
}

export default useEagerConnect
