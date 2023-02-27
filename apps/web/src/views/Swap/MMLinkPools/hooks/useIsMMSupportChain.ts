import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { MM_SUPPORT_CHIAN } from '../constants'

export const useIsMMSupportChain = () => {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => {
    return Boolean(MM_SUPPORT_CHIAN[chainId])
  }, [chainId])
}
