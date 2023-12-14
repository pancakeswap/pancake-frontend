import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { GRAPH_API_PREDICTION_ETH } from '../../endpoints'
import { predictionsBNB } from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.ETH]: {
    isNativeToken: true,
    address: predictionsBNB[ChainId.ZKSYNC],
    api: GRAPH_API_PREDICTION_ETH[ChainId.ZKSYNC],
    galetoOracleAddress: '0x123',
    displayedDecimals: 4,
    token: Native.onChain(ChainId.ZKSYNC),
  },
}
