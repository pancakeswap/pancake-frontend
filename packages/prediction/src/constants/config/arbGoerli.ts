import { arbitrumGoerliTokens } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/chains'
import { GRAPH_API_PREDICTION_BNB } from '../../endpoints'
import { PredictionSupportedSymbol, BasePredictionConfig } from '../../type'

export const predictions: Record<string, BasePredictionConfig> = {
  [PredictionSupportedSymbol.ETH]: {
    isNativeToken: false,
    address: '0xd5330586c035a67bd32A6FD8e390c72DB9372861',
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC],
    chainlinkOracleAddress: '0xd5330586c035a67bd32A6FD8e390c72DB9372861',
    displayedDecimals: 4,
    token: arbitrumGoerliTokens.weth,
  },
}
