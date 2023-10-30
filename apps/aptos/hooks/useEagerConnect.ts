import { useClient, useConnect } from '@pancakeswap/awgmi'
import { useEffect } from 'react'
import { chains } from 'config/chains'

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
      import('@pancakeswap/awgmi/connectors/msafe').then(({ MsafeConnector }) => {
        const msafe = new MsafeConnector({ chains })
        connectAsync({ connector: msafe }).catch(() => {
          config.autoConnect()
        })
      })
    } else {
      config.autoConnect()
    }
  }, [config, connectAsync, connectors])
}

export default useEagerConnect
