import { ChainId } from '@pancakeswap/chains'
import { GAUGES } from 'config/constants/gauges'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'

export const useGaugesPresets = () => {
  const { chainId } = useActiveChainId()

  return useMemo(() => {
    if (chainId && GAUGES[chainId]) return GAUGES[chainId]
    return GAUGES[ChainId.BSC]
  }, [chainId])
}
