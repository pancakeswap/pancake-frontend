import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { GRAPH_API_PREDICTION_BNB } from '../../endpoints'
import { predictionsBNB } from '../../predictionContract'
import { PredictionConfig, PredictionSupportedSymbol } from '../../type'

// Only for testing AI prediction market for Arbitrum
export const predictions: Record<string, PredictionConfig> = {
  [PredictionSupportedSymbol.BNB]: {
    isNativeToken: true,
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC_TESTNET],
    address: predictionsBNB[ChainId.BSC_TESTNET],
    token: Native.onChain(ChainId.BSC_TESTNET),
    tokenBackgroundColor: '#F0B90B',
    displayedDecimals: 4,

    livePriceDecimals: 2, // Binance API for this pair provides price upto 2 decimals
    lockPriceDecimals: 18,
    closePriceDecimals: 18,

    ai: {
      aiPriceDecimals: 18,
    },
  },
}
