import { WormholeChainIds } from '../../components/WormHole/chains'

const pocketPrefix = {
  [WormholeChainIds.ARBITRUM_ONE]: 'arbitrum-one',
  [WormholeChainIds.BASE]: 'base-mainnet',
  [WormholeChainIds.BSC]: 'bsc-mainnet',
  [WormholeChainIds.ETHEREUM]: 'eth-mainnet',
  [WormholeChainIds.SOLANA]: 'solana-mainnet',
} as const

export const getPoktUrl = (chainId: keyof typeof pocketPrefix, key?: string) => {
  if (!key) {
    return null
  }

  const url = `https://${pocketPrefix[chainId]}.gateway.pokt.network/v1/lb/${key}`
  return url
}

export const getGroveUrl = (chainId: keyof typeof pocketPrefix, key?: string) => {
  if (!key) {
    return null
  }

  const url = `https://${pocketPrefix[chainId]}.rpc.grove.city/v1/${key}`
  return url
}
