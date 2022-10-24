import shallow from 'zustand/shallow'
import { getClient } from '../client'
import type { Chain } from '../chain'

export type GetNetworkResult = {
  chain?: Chain & {
    unsupported?: boolean
  }
  chains: Chain[]
}

export function getNetwork(): GetNetworkResult {
  const client = getClient()

  const networkName = client.data?.network
  const activeChains = client.chains ?? []
  const activeChain = activeChains.find((x) => x.network.toLowerCase() === networkName?.toLowerCase()) ?? {
    id: 0,
    name: `Chain ${networkName}`,
    network: networkName ?? 'Unknown',
    nodeUrls: { default: '' },
  }

  return {
    chain: networkName
      ? {
          ...activeChain,
          unsupported: client.connector?.isChainUnsupported(networkName),
        }
      : undefined,
    chains: activeChains,
  } as const
}

export type WatchNetworkCallback = (data: GetNetworkResult) => void

export type WatchNetworkConfig = {
  selector?({ networkName, chains }: { networkName?: string; chains?: Chain[] }): any
}

export function watchNetwork(callback: WatchNetworkCallback, { selector = (x) => x }: WatchNetworkConfig = {}) {
  const client = getClient()
  const handleChange = () => callback(getNetwork())
  const unsubscribe = client.subscribe(
    ({ data, chains }) => selector({ networkName: data?.network, chains }),
    handleChange,
    {
      equalityFn: shallow,
    },
  )
  return unsubscribe
}
