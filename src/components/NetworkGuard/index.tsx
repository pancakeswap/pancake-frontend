import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { useEffect } from 'react'
import { setupNetwork } from 'utils/wallet'

export class CustomUnsupportedChainIdError extends UnsupportedChainIdError {
  chainId?: number
}

export function createNetworkGuard(chainId: string | number) {
  return ({ children }) => {
    const { chainId: currentChainId, library, setError, connector, activate, deactivate } = useWeb3React()

    useEffect(() => {
      if (currentChainId && currentChainId !== +chainId) {
        const error = new CustomUnsupportedChainIdError(currentChainId, [+chainId])
        error.chainId = +chainId
        setError(error)
        setupNetwork(undefined, +chainId)
      }
    }, [activate, connector, currentChainId, deactivate, library, setError])

    useEffect(() => {
      if (connector) {
        activate(connector)
      } else {
        deactivate()
      }
    }, [activate, connector, deactivate])

    return children
  }
}
