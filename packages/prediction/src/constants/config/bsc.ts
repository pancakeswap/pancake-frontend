import { bscTokens } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/chains'
import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from '../../endpoints'
import { PredictionSupportedSymbol, PredictionConfig } from '../../type'
import { predictionsBNB, predictionsCAKE } from '../../predictionContract'
import { chainlinkOracleBNB, chainlinkOracleCAKE } from '../../chainlinkOracleContract'

export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.BNB]: {
    isNativeToken: true,
    address: predictionsBNB[ChainId.BSC],
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC],
    chainlinkOracleAddress: chainlinkOracleBNB[ChainId.BSC],
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  [PredictionSupportedSymbol.CAKE]: {
    isNativeToken: false,
    address: predictionsCAKE[ChainId.BSC],
    api: GRAPH_API_PREDICTION_CAKE[ChainId.BSC],
    chainlinkOracleAddress: chainlinkOracleCAKE[ChainId.BSC],
    displayedDecimals: 4,
    token: bscTokens.cake,
  },
}
