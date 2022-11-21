import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useProviderOrSigner = (withSignerIfPossible = true, forceBSC?: boolean) => {
  const { chainId } = useActiveChainId()
  const provider = useProvider({ chainId: forceBSC ? ChainId.BSC : chainId })
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()

  return useMemo(
    () => (withSignerIfPossible && address && isConnected && signer ? signer : provider),
    [address, isConnected, provider, signer, withSignerIfPossible],
  )
}
