import { useMemo } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useProviderOrSigner = (withSignerIfPossible = true) => {
  const { chainId } = useActiveChainId()
  const provider = useProvider({ chainId })
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()

  return useMemo(
    () => (withSignerIfPossible && address && isConnected && signer ? signer : provider),
    [address, isConnected, provider, signer, withSignerIfPossible],
  )
}
