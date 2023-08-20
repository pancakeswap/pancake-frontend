import { ChainId } from '@pancakeswap/sdk'
import { OnChainProvider, SubgraphProvider } from '@pancakeswap/smart-router/evm'
import { createPublicClient, http } from 'viem'
import { bsc, bscTestnet, goerli, mainnet } from 'viem/chains'
import { GraphQLClient } from 'graphql-request'

import { V3_SUBGRAPH_URLS, SupportedChainId } from './constants'

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

const bscClient = createPublicClient({
  chain: bsc,
  transport: http(BSC_NODE),
})

const bscTestnetClient = createPublicClient({
  chain: bscTestnet,
  transport: http(BSC_TESTNET_NODE),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
})

// @ts-ignore
export const viemProviders: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
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

export const v3SubgraphClients: Record<SupportedChainId, GraphQLClient> = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM], { fetch }),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.POLYGON_ZKEVM], { fetch }),
  [ChainId.ZKSYNC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ZKSYNC], { fetch }),
  [ChainId.LINEA_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.LINEA_TESTNET], { fetch }),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI], { fetch }),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC], { fetch }),
  [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET], { fetch }),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ARBITRUM_ONE], { fetch }),
} as const

export const v3SubgraphProvider: SubgraphProvider = ({ chainId = ChainId.BSC }: { chainId?: ChainId }) => {
  return v3SubgraphClients[chainId as SupportedChainId] || v3SubgraphClients[ChainId.BSC]
}
