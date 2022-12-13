import { ChainId } from '@pancakeswap/sdk'
// http://159.135.194.92:33333/subgraphs/name/pancakeswap/exchange-cake-pairs
export const GRAPH_API_PROFILE = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/profile'
export const GRAPH_API_PREDICTION_BNB = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/prediction-v2'
export const GRAPH_API_PREDICTION_CAKE = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/prediction-cake'

export const GRAPH_API_LOTTERY = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/lottery'
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.pancakeswap.com'
export const API_NFT = 'https://nft.pancakeswap.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const GRAPH_API_POTTERY = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/pottery'

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/prediction'

export const INFO_CLIENT = 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange'
export const INFO_NR_CLIENT = 'https://proxy-worker-dev.pancake-swap.workers.dev/bsc-exchange'
export const INFO_CLIENT_ETH = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/exhange-eth'
export const BLOCKS_CLIENT = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/blocks'
export const BLOCKS_CLIENT_ETH = 'http://159.135.194.92:33333/subgraphs/name/blocklytics/ethereum-blocks'
export const STABLESWAP_SUBGRAPH_CLIENT = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/exchange-stableswap'
export const GRAPH_API_NFTMARKET = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/nft-market'
export const GRAPH_HEALTH = 'http://159.135.194.92:33333/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/trading-competition-v3'
export const TC_MOD_SUBGRAPH = 'http://159.135.194.92:33333/subgraphs/name/pancakeswap/trading-competition-v4'

export const FARM_API = 'https://farms.pancake-swap.workers.dev'

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = 'https://red.alert.pancakeswap.com/red-api'

export const CELER_API = 'https://api.celerscan.com/scan'

export const INFO_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: 'https://pancakeswap.nodereal.io/graphql/',
  [ChainId.ETHEREUM]: INFO_CLIENT_ETH,
}

export const BLOCKS_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: BLOCKS_CLIENT,
  [ChainId.ETHEREUM]: BLOCKS_CLIENT_ETH,
}
