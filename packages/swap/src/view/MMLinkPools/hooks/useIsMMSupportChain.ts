import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { MM_SUPPORT_CHAIN } from '../constants'

export const useIsMMSupportChain = () => {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    return Boolean(MM_SUPPORT_CHAIN[chainId])
  }, [chainId])
}
