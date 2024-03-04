import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useAccountActiveChain = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  return useMemo(() => ({ account, chainId }), [account, chainId])
}

export default useAccountActiveChain
