import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { GRAPH_API_PREDICTION_ETH } from '../../endpoints'
import { galetoOracleETH } from '../../galetoOracleContract'
import { predictionsETH } from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.ETH]: {
    isNativeToken: true,
    address: predictionsETH[ChainId.ZKSYNC],
    api: GRAPH_API_PREDICTION_ETH[ChainId.ZKSYNC],
    galetoOracleAddress: galetoOracleETH[ChainId.ZKSYNC],
    displayedDecimals: 4,
    token: Native.onChain(ChainId.ZKSYNC),
    tokenBackgroundColor: '#647ceb',
  },
}
