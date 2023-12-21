import { bscTokens } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/chains'
import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from '../../endpoints'
import { PredictionSupportedSymbol, BasePredictionConfig } from '../../type'

export const predictions: Record<string, BasePredictionConfig> = {
  [PredictionSupportedSymbol.BNB]: {
    isNativeToken: true,
    address: '0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA',
    api: GRAPH_API_PREDICTION_BNB[ChainId.BSC],
    chainlinkOracleAddress: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  [PredictionSupportedSymbol.CAKE]: {
    isNativeToken: false,
    address: '0x0E3A8078EDD2021dadcdE733C6b4a86E51EE8f07',
    api: GRAPH_API_PREDICTION_CAKE[ChainId.BSC],
    chainlinkOracleAddress: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1',
    displayedDecimals: 4,
    token: bscTokens.cake,
  },
}
