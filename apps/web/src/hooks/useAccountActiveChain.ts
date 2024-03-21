import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useAccountActiveChain = () => {
  const { address: account, status, connector } = useAccount()
  const { chainId } = useActiveChainId()

  return useMemo(() => ({ account, chainId, status, connector }), [account, chainId, connector, status])
}

export default useAccountActiveChain
