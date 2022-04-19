import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { isMobile } from 'react-device-detect'
import { injected } from 'utils/web3React'
import { useWeb3React } from '@web3-react/core'

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
    const tryLogin = (c: ConnectorNames) => {
      setTimeout(() => login(c))
    }

    const connectorId =
      typeof window?.localStorage?.getItem === 'function' &&
      (window?.localStorage?.getItem(connectorLocalStorageKey) as ConnectorNames)

    if (connectorId) {
      const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => login(connectorId))

        return
      }
      if (connectorId === ConnectorNames.Injected) {
        // somehow injected login not working well on development mode
        injected.isAuthorized().then(() => tryLogin(connectorId))
      } else {
        tryLogin(connectorId)
      }
    } else {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          tryLogin(ConnectorNames.Injected)
        } else {
          // eslint-disable-next-line no-lonely-if
          if (isMobile && window.ethereum) {
            tryLogin(ConnectorNames.Injected)
          }
        }
      })
    }
  }, [login])
}

export default useEagerConnect
