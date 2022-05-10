import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import useEagerConnect from 'hooks/useEagerConnect'
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
        const err = new CustomUnsupportedChainIdError(currentChainId, [+chainId])
        err.chainId = +chainId
        setError(err)
        setupNetwork(undefined, +chainId)
      }
    }, [activate, connector, currentChainId, deactivate, library, setError])

    useEagerConnect(chainId)

    return children
  }
}
