import { chains, defaultChain } from 'config/chains'

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  networkName?: string,
): string {
  const chain = chains.find((c) => c.network === networkName)
  if (!chain) return defaultChain.blockExplorers?.default.url ?? ''
  // only Devnet is capital
  const query = `?network=${chain.network === 'devnet' ? 'Devnet' : chain.id}`
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers?.default.url}/txn/${data}${query}`
    }
    default: {
      return `${chain.blockExplorers?.default.url}/account/${data}${query}`
    }
  }
}

export const isChainSupported = (network?: string): network is string =>
  !!network && chains.map((c) => c.network).includes(network.toLowerCase())
