import { ChainId } from '@pancakeswap/sdk'
import {
  BIT_QUERY,
  INFO_CLIENT,
  STABLESWAP_SUBGRAPH_CLIENT,
  INFO_CLIENT_ETH,
  V3_SUBGRAPH_URLS,
} from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import { ChainId } from '@pancakeswap/sdk'
import { INFO_CLIENT_WITH_CHAIN, V3_POOL_SUBGRAPH_WITH_CHAIN } from '../config/constants/endpoints'

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getGQLHeaders = (endpoint: string) => {
  if (endpoint === INFO_CLIENT) {
    return {
      origin:
        process.env.NEXT_PUBLIC_NODE_REAL_HEADER ||
        // hack for inject CI secret on window
        (typeof window !== 'undefined' &&
          // @ts-ignore
          window.nrHeader),
    }
  }
  return undefined
}

export const infoClient = new GraphQLClient(INFO_CLIENT)

export const infoClientWithChain = (chainId: number) => {
  return new GraphQLClient(INFO_CLIENT_WITH_CHAIN[chainId], { headers: getGQLHeaders(INFO_CLIENT_WITH_CHAIN[chainId]) })
}

export const v3Clients = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM]),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI]),
  // TODO: v3 swap update
  // [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET]),
}

export const swapClientWithChain = (chainId: ChainId) => {
  return new GraphQLClient(V3_POOL_SUBGRAPH_WITH_CHAIN[chainId])
}

export const infoClientETH = new GraphQLClient(INFO_CLIENT_ETH)

export const infoStableSwapClient = new GraphQLClient(STABLESWAP_SUBGRAPH_CLIENT)

export const infoServerClient = new GraphQLClient(INFO_CLIENT, {
  timeout: 5000,
  headers: {
    origin: 'https://pancakeswap.finance',
  },
})

export const stableSwapClient = new GraphQLClient(STABLESWAP_SUBGRAPH_CLIENT)

export const bitQueryServerClient = new GraphQLClient(BIT_QUERY, {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    'X-API-KEY': process.env.BIT_QUERY_HEADER,
  },
  timeout: 5000,
})
