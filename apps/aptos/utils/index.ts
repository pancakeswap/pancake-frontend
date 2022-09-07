import { chains, defaultChain } from 'config/chains'

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  networkName?: string,
): string {
  const chain = chains.find((c) => c.network === networkName)
  if (!chain) return defaultChain.blockExplorers.default.url
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers.default.url}/txn/${data}`
    }
    default: {
      return `${chain.blockExplorers.default.url}/account/${data}`
    }
  }
}

export const isChainSupported = (network?: string): network is string =>
  !!network && chains.map((c) => c.network).includes(network.toLowerCase())
