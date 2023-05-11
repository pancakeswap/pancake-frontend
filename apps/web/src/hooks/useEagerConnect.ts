import { useConfig, useConnect } from 'wagmi'
import { useEffect } from 'react'
import { CHAINS } from 'config/chains'

const useEagerConnect = () => {
  const config = useConfig()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    if (
      !(typeof window === 'undefined') &&
      window?.parent !== window &&
      // @ts-ignore
      !window.cy
    ) {
      import('wagmi/connectors/safe').then(({ SafeConnector }) => {
        const safe = new SafeConnector({ chains: CHAINS })
        connectAsync({ connector: safe }).catch(() => {
          config.autoConnect()
        })
      })
    } else {
      config.autoConnect()
    }
  }, [config, connectAsync, connectors])
}

export default useEagerConnect
