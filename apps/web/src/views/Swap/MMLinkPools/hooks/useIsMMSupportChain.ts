import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { MM_SUPPORT_CHAIN } from '../constants'

export const useIsMMSupportChain = () => {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    return Boolean(chainId && MM_SUPPORT_CHAIN[chainId])
  }, [chainId])
}
