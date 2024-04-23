import { isInBinance } from '@binance/w3w-utils'
import { isCyberWallet } from '@cyberlab/cyber-app-sdk'
import { useEffect } from 'react'
import { useConfig, useConnect } from 'wagmi'

import { binanceWeb3WalletConnector, cyberWalletConnector } from 'utils/wagmi'

const useEagerConnect = () => {
  const config = useConfig()
  const { connectAsync, connectors } = useConnect()
  useEffect(() => {
    if (!(typeof window === 'undefined') && window?.parent !== window && isCyberWallet() && cyberWalletConnector) {
      connectAsync({ connector: cyberWalletConnector as any })
    } else if (isInBinance()) {
      connectAsync({ connector: binanceWeb3WalletConnector() })
    }
  }, [config, connectAsync, connectors])
}

export default useEagerConnect
