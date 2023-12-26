import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { chainlinkOracleBNB, chainlinkOracleCAKE } from '../../chainlinkOracleContract'
import { GRAPH_API_PREDICTION_BNB, GRAPH_API_PREDICTION_CAKE } from '../../endpoints'
import { predictionsBNB, predictionsCAKE } from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.BNB]: {
    isNativeToken: true,
    address: predictionsBNB[ChainId.BSC],
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC],
    chainlinkOracleAddress: chainlinkOracleBNB[ChainId.BSC],
    displayedDecimals: 4,
    token: Native.onChain(ChainId.BSC),
    tokenBackgroundColor: '#F0B90B',
  },
  [PredictionSupportedSymbol.CAKE]: {
    isNativeToken: false,
    address: predictionsCAKE[ChainId.BSC],
    api: GRAPH_API_PREDICTION_CAKE[ChainId.BSC],
    chainlinkOracleAddress: chainlinkOracleCAKE[ChainId.BSC],
    displayedDecimals: 4,
    token: bscTokens.cake,
    tokenBackgroundColor: '#25C7D6',
  },
}
