import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { chainlinkOracleBNB } from '../../chainlinkOracleContract'
import { GRAPH_API_PREDICTION_BNB } from '../../endpoints'
import { predictionsBNB } from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

// Only for testing AI prediction market for Arbitrum
export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.BNB]: {
    isNativeToken: true,
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC_TESTNET],
    address: predictionsBNB[ChainId.BSC_TESTNET],
    chainlinkOracleAddress: chainlinkOracleBNB[ChainId.BSC_TESTNET], // Later should use CMC API on Arbitrum
    displayedDecimals: 4,
    token: Native.onChain(ChainId.BSC_TESTNET),
    tokenBackgroundColor: '#F0B90B',

    isAIPrediction: true,
    AIPriceDecimals: 18,
    lockPriceDecimals: 18,
    closePriceDecimals: 18,
  },
}
