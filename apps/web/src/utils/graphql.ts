import { ChainId } from '@pancakeswap/chains'
import { STABLE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/stable-swap-sdk'
import { BIT_QUERY, STABLESWAP_SUBGRAPHS_URLS, V3_BSC_INFO_CLIENT, V3_SUBGRAPH_URLS } from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import { V2_SUBGRAPH_URLS } from '../config/constants/endpoints'

export const infoClient = new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.BSC])

export const v3Clients = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM]),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI]),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC]),
  [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET]),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ARBITRUM_ONE]),
  [ChainId.ARBITRUM_GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ARBITRUM_GOERLI]),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.POLYGON_ZKEVM]),
  [ChainId.ZKSYNC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ZKSYNC]),
  [ChainId.ZKSYNC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ZKSYNC_TESTNET]),
  [ChainId.LINEA]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.LINEA]),
  [ChainId.LINEA_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.LINEA_TESTNET]),
  [ChainId.BASE]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BASE]),
  [ChainId.BASE_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BASE_TESTNET]),
  [ChainId.SCROLL_SEPOLIA]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.SCROLL_SEPOLIA]),
  [ChainId.OPBNB]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.OPBNB]),
}

export const v3InfoClients = { ...v3Clients, [ChainId.BSC]: new GraphQLClient(V3_BSC_INFO_CLIENT) }

export const v2Clients = {
  [ChainId.ETHEREUM]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.ETHEREUM]),
  [ChainId.BSC]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.BSC]),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.POLYGON_ZKEVM]),
  [ChainId.ZKSYNC]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.ZKSYNC]),
  [ChainId.LINEA]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.LINEA]),
  [ChainId.BASE]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.BASE]),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.ARBITRUM_ONE]),
  [ChainId.OPBNB]: new GraphQLClient(V2_SUBGRAPH_URLS[ChainId.OPBNB]),
}

export const infoStableSwapClients: Record<(typeof STABLE_SUPPORTED_CHAIN_IDS)[number], GraphQLClient> = {
  [ChainId.BSC]: new GraphQLClient(STABLESWAP_SUBGRAPHS_URLS[ChainId.BSC]),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(STABLESWAP_SUBGRAPHS_URLS[ChainId.ARBITRUM_ONE]),
  [ChainId.ETHEREUM]: new GraphQLClient(STABLESWAP_SUBGRAPHS_URLS[ChainId.ETHEREUM]),
  [ChainId.BSC_TESTNET]: new GraphQLClient(STABLESWAP_SUBGRAPHS_URLS[ChainId.BSC_TESTNET]),
}

export const bitQueryServerClient = new GraphQLClient(BIT_QUERY, {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    'X-API-KEY': process.env.BIT_QUERY_HEADER || '',
  },
  timeout: 5000,
})
