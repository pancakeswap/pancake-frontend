import { ChainId } from '@pancakeswap/chains'
import { SupportedChainId } from './constants/supportedChains'
import { EndPointType } from './type'

export const GRAPH_API_PREDICTION_BNB = {
  [ChainId.BSC]: 'https://thegraph.pancakeswap.com/prediction-v2-bsc',
  [ChainId.ZKSYNC]: '',
  [ChainId.ARBITRUM_ONE]: '',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_CAKE = {
  [ChainId.BSC]: 'https://thegraph.pancakeswap.com/prediction-cake-bsc',
  [ChainId.ZKSYNC]: '',
  [ChainId.ARBITRUM_ONE]: '',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_ETH = {
  [ChainId.BSC]: '',
  [ChainId.ZKSYNC]: 'https://api.studio.thegraph.com/query/48759/prediction-v2-zksync-era/version/latest',
  [ChainId.ARBITRUM_ONE]: 'https://thegraph.pancakeswap.com/prediction-v3-ai-arb',
} as const satisfies EndPointType<SupportedChainId>

export const GRAPH_API_PREDICTION_WBTC = {
  [ChainId.BSC]: '',
  [ChainId.ZKSYNC]: '',
  [ChainId.ARBITRUM_ONE]: '',
} as const satisfies EndPointType<SupportedChainId>
