import { useAllTokensByChainIds } from 'hooks/Tokens'
import { useMemo } from 'react'
import { safeGetAddress } from 'utils'
import type { Address } from 'viem'

export const useTokenByChainId = (tokenAddress?: Address, chainId?: number) => {
  const tokens = useAllTokensByChainIds(chainId ? [chainId] : [])
  return useMemo(() => {
    return chainId && tokenAddress ? tokens[chainId][safeGetAddress(tokenAddress)!] : undefined
  }, [chainId, tokenAddress, tokens])
}
