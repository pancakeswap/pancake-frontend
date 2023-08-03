import { useQuery } from '@tanstack/react-query'
import { getActiveIfo, getInActiveIfos, getIfoConfig } from '@pancakeswap/ifos'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'

export function useIfoConfigs() {
  const { chainId } = useActiveChainId()
  const { data } = useQuery([chainId, 'ifo-configs'], async () => getIfoConfig(chainId))
  return data
}

export function useActiveIfoConfig() {
  const { chainId } = useActiveChainId()
  const { data } = useQuery([chainId, 'active-ifo'], () => getActiveIfo(chainId))
  return data
}

export function useInActiveIfoConfigs() {
  const { chainId } = useActiveChainId()
  const { data } = useQuery([chainId, 'inactive-ifo-configs'], () => getInActiveIfos(chainId))
  return data
}

export function useIfoConfigById(id: string) {
  const configs = useIfoConfigs()
  return useMemo(() => configs?.find((ifo) => ifo.id === id), [configs, id])
}
