import { ChainId } from '@pancakeswap/sdk'
import { createPublicClient, http, PublicClient } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains'

const requireCheck = [ETH_NODE, GOERLI_NODE, BSC_NODE, BSC_TESTNET_NODE]
requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_NODE),
})

export const bscClient: PublicClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
})

export const bscTestnetClient: PublicClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
})

export const viemProviders = ({ chainId }: { chainId?: ChainId }): PublicClient => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.BSC:
      return bscClient
    case ChainId.BSC_TESTNET:
      return bscTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    default:
      return bscClient
  }
}
