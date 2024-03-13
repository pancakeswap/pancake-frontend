import { WormholeChainIds } from '../../components/WormHole/chains'

export const getNodeRealUrl = (chainId: number, key?: string) => {
  let host: string | null = null

  switch (chainId) {
    case WormholeChainIds.ETHEREUM:
      if (key) {
        host = `eth-mainnet.nodereal.io/v1/${key}`
      }
      break
    case WormholeChainIds.GOERLI:
      if (key) {
        host = `eth-goerli.nodereal.io/v1/${key}`
      }
      break
    case WormholeChainIds.BSC:
      if (key) {
        host = `bsc-mainnet.nodereal.io/v1/${key}`
      }
      break
    case WormholeChainIds.ARBITRUM_ONE:
      if (key) {
        host = `open-platform.nodereal.io/${key}/arbitrum-nitro`
      }
      break
    case WormholeChainIds.BASE:
      if (key) {
        host = `open-platform.nodereal.io/${key}/base`
      }
      break
    case WormholeChainIds.SOLANA: //  sol mainnet
      if (key) {
        host = `open-platform.nodereal.io/${key}/solana/`
      }
      break
    default:
      host = null
  }

  if (!host) {
    return null
  }

  const url = `https://${host}`
  return url
}
