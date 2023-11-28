import { ChainId } from '@pancakeswap/chains'
import { arbitrumGoerliTokens } from '@pancakeswap/tokens'
import { chainlinkOracleETH } from '../../chainlinkOracleContract'
import { GRAPH_API_PREDICTION_ETH } from '../../endpoints'
import { predictionsETH } from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.ETH]: {
    isNativeToken: false,
    address: predictionsETH[ChainId.ARBITRUM_GOERLI],
    api: GRAPH_API_PREDICTION_ETH[ChainId.ARBITRUM_GOERLI],
    chainlinkOracleAddress: chainlinkOracleETH[ChainId.ARBITRUM_GOERLI],
    displayedDecimals: 4,
    token: arbitrumGoerliTokens.weth,
  },
}
