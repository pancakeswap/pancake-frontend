import { useQuery } from '@tanstack/react-query'
import { getActiveIfo, getInActiveIfos, getIfoConfig, SUPPORTED_CHAIN_IDS, Ifo } from '@pancakeswap/ifos'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import sortBy from 'lodash/sortBy'

export function useIfoConfigs() {
  const { chainId } = useActiveChainId()
  const { data } = useQuery({
    queryKey: [chainId, 'ifo-configs'],
    queryFn: () => getIfoConfig(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  return data
}

export function useIfoConfigsAcrossChains() {
  const { data } = useQuery({
    queryKey: ['ifo-configs'],
    queryFn: async () => {
      const configs = await Promise.all(SUPPORTED_CHAIN_IDS.map(getIfoConfig))
      return configs.reduce<Ifo[]>((acc, cur) => [...acc, ...cur], [])
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  return data
}

export function useActiveIfoConfig() {
  const { chainId } = useActiveChainId()
  const { data, isPending } = useQuery({
    queryKey: [chainId, 'active-ifo'],
    queryFn: () => getActiveIfo(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  return {
    activeIfo: data,
    isPending,
  }
}

export function useInActiveIfoConfigs() {
  const { chainId } = useActiveChainId()
  const { data } = useQuery({
    queryKey: [chainId, 'inactive-ifo-configs'],
    queryFn: () => getInActiveIfos(chainId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  return data
}

export function useIfoConfigById(id: string) {
  const configs = useIfoConfigs()
  return useMemo(() => configs?.find((ifo) => ifo.id === id), [configs, id])
}

export function useIfoConfigAcrossChainsById(id: string) {
  const configs = useIfoConfigsAcrossChains()
  return useMemo(() => configs?.find((ifo) => ifo.id === id), [configs, id])
}

export function useActiveIfoConfigAcrossChains() {
  const configs = useIfoConfigsAcrossChains()
  return useMemo(() => {
    const sortedConfigs = sortBy(configs, 'plannedStartTime')
    return sortedConfigs?.find((ifo) => ifo.isActive)
  }, [configs])
}
