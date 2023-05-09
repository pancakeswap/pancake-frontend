import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useProviderOrSigner = (withSignerIfPossible = true, forceBSC?: boolean) => {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId: forceBSC ? ChainId.BSC : chainId })
  const { address, isConnected } = useAccount()
  const { data: signer } = useWalletClient()

  return useMemo(
    () => (withSignerIfPossible && address && isConnected && signer ? signer : provider),
    [address, isConnected, provider, signer, withSignerIfPossible],
  )
}
