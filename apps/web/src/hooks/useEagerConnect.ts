import { useEffect } from 'react'
import { useConfig, useConnect } from 'wagmi'
// import { cyberWalletConnector, binanceWeb3WalletConnector } from 'utils/wagmi'

const useEagerConnect = () => {
  const config = useConfig()

  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    // if (!(typeof window === 'undefined') && window?.parent !== window && isCyberWallet() && cyberWalletConnector) {
    //   connectAsync({ connector: cyberWalletConnector as any }).catch(() => {
    //     config.autoConnect()
    //   })
    //   return
    // }
    // if (isInBinance()) {
    //   connectAsync({ connector: binanceWeb3WalletConnector }).catch(() => {
    //     config.autoConnect()
    //   })
    //   return
    // }
    // if (
    //   !(typeof window === 'undefined') &&
    //   window?.parent !== window &&
    //   // @ts-ignore
    //   !window.cy
    // ) {
    //   import('wagmi/connectors/safe').then(({ SafeConnector }) => {
    //     const safe = new SafeConnector({ chains: CHAINS })
    //     connectAsync({ connector: safe }).catch(() => {
    //       config.autoConnect()
    //     })
    //   })
    //   return
    // }
    // config.autoConnect()
  }, [config, connectAsync, connectors])
}

export default useEagerConnect
