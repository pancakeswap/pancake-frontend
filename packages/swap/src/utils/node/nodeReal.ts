import { ChainId } from '@pancakeswap/chains'

export const getNodeRealUrl = (chainId: number, key?: string) => {
  let host: string | null = null

  switch (chainId) {
    case ChainId.ETHEREUM:
      if (key) {
        host = `eth-mainnet.nodereal.io/v1/${key}`
      }
      break
    case ChainId.GOERLI:
      if (key) {
        host = `eth-goerli.nodereal.io/v1/${key}`
      }
      break
    case ChainId.BSC:
      if (key) {
        host = `bsc-mainnet.nodereal.io/v1/${key}`
      }
      break
    case ChainId.OPBNB:
      if (key) {
        host = `opbnb-mainnet.nodereal.io/v1/${key}`
      }
      break
    case ChainId.POLYGON_ZKEVM:
      if (key) {
        host = `open-platform.nodereal.io/${key}/polygon-zkevm-rpc`
      }
      break
    case ChainId.ARBITRUM_ONE:
      if (key) {
        host = `open-platform.nodereal.io/${key}/arbitrum-nitro`
      }
      break
    case ChainId.BASE:
      if (key) {
        host = `open-platform.nodereal.io/${key}/base`
      }
      break
    case ChainId.ZKSYNC:
      if (key) {
        host = `open-platform.nodereal.io/${key}/zksync`
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
