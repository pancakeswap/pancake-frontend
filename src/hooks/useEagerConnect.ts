const useEagerConnect = () => {
  // const { login } = useAuth()
  // useEffect(() => {
  //   const tryLogin = (c: ConnectorNames) => {
  //     setTimeout(() => login(c))
  //   }
  //   const connectorId = safeGetLocalStorageItem()
  //   if (connectorId) {
  //     const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
  //     const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')
  //     // Currently BSC extension doesn't always inject in time.
  //     // We must check to see if it exists, and if not, wait for it before proceeding.
  //     if (isConnectorBinanceChain && !isBinanceChainDefined) {
  //       _binanceChainListener().then(() => login(connectorId))
  //       return
  //     }
  //     // Prevent eager connect on mobile & coinbase wallet not injected, as it keeps trying deeplink to app store.
  //     if (connectorId === ConnectorNames.WalletLink && isMobile && window?.ethereum?.isCoinbaseWallet !== true) {
  //       return
  //     }
  //     if (connectorId === ConnectorNames.Injected) {
  //       const isEthereumDefined = Reflect.has(window, 'ethereum')
  //       // handle opera lazy inject ethereum
  //       if (!isEthereumDefined) {
  //         _ethereumListener().then(() => tryLogin(connectorId))
  //         return
  //       }
  //       // somehow injected login not working well on development mode
  //       injected.isAuthorized().then(() => tryLogin(connectorId))
  //     } else {
  //       tryLogin(connectorId)
  //     }
  //   } else {
  //     // Dapp browse will try login even is not authorized.
  //     injected.isAuthorized().then(() => {
  //       if (isMobile && window.ethereum) {
  //         tryLogin(ConnectorNames.Injected)
  //       }
  //     })
  //   }
  // }, [login])
}

export default useEagerConnect
