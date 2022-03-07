import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { isMobile } from 'react-device-detect'
import { injected } from 'utils/web3React'

const _binanceChainListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'BinanceChain', {
      get() {
        return this.bsc
      },
      set(bsc) {
        this.bsc = bsc

        resolve()
      },
    }),
  )

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId))

        return
      }
      const isConnectorInjected = connectorId === ConnectorNames.Injected
      if (isConnectorInjected) {
        injected.isAuthorized().then((isAuthorized) => {
          if (isAuthorized) {
            setTimeout(() => {
              login(connectorId)
            })
          } else {
            // eslint-disable-next-line no-lonely-if
            if (isMobile && window.ethereum) {
              setTimeout(() => {
                login(connectorId)
              })
            }
          }
        })
      } else {
        login(connectorId)
      }
    }
  }, [login])
}

export default useEagerConnect
