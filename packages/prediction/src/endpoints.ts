import { ChainId } from '@pancakeswap/chains'
import { SupportedChainId } from './constants/supportedChains'
import { EndPointType } from './type'

export const GRAPH_API_PREDICTION_BNB = {
  [ChainId.BSC]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2',
  [ChainId.BSC_TESTNET]: '', // for TESTING. Remove later
  [ChainId.ZKSYNC]: '',
  // [ChainId.ARBITRUM_ONE]: '',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_CAKE = {
  [ChainId.BSC]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-cake',
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
