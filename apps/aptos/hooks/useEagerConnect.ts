import { useClient, useConnect } from '@pancakeswap/awgmi'
import { useEffect } from 'react'
import { msafeConnector } from 'client'

const useEagerConnect = () => {
  const config = useClient()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    if (
      !(typeof window === 'undefined') &&
      window?.parent !== window &&
      // @ts-ignore
      !window.cy
    ) {
      connectAsync({ connector: msafeConnector }).catch(() => {
        config.autoConnect()
      })
    } else {
      config.autoConnect()
    }
  }, [config, connectAsync, connectors])
}

export default useEagerConnect
