import { ChainId } from '@pancakeswap/chains'
import { SupportedChainId } from './constants/supportedChains'
import { EndPointType } from './type'

export const GRAPH_API_PREDICTION_BNB = {
  [ChainId.BSC]: 'https://thegraph.pancakeswap.com/prediction-v2-bsc',
  [ChainId.BSC_TESTNET]: 'https://api.studio.thegraph.com/query/30127/huan-prediction-v3-ai-chapel-2/version/latest', // for TESTING. Remove later
  [ChainId.ZKSYNC]: '',
  // [ChainId.ARBITRUM_ONE]: '',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_CAKE = {
  [ChainId.BSC]: 'https://thegraph.pancakeswap.com/prediction-cake-bsc',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ZKSYNC]: '',
  // [ChainId.ARBITRUM_ONE]: '',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_ETH = {
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ZKSYNC]: 'https://api.studio.thegraph.com/query/48759/prediction-v2-zksync-era/version/latest',
  // [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2-arbitrum',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_WBTC = {
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ZKSYNC]: '',
  // [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2-arbitrum-wbtc',
} as const satisfies EndPointType<SupportedChainId>
