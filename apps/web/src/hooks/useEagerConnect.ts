import { useEffect } from 'react'
import { useConfig, useConnect } from 'wagmi'
import { reconnect } from 'wagmi/actions'

const useEagerConnect = () => {
  const config = useConfig()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    reconnect(config)
  }, [config, connectAsync, connectors])
}
export default useEagerConnect
