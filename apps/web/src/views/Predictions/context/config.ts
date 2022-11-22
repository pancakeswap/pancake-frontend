import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { bscTokens } from '@pancakeswap/tokens'

export default {
  BNB: {
    address: getAddress(addresses.predictionsBNB),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleBNB),
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  CAKE: {
    address: getAddress(addresses.predictionsCAKE),
    api: GRAPH_API_PREDICTION_CAKE,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleCAKE),
    displayedDecimals: 4,
    token: bscTokens.cake,
  },
}
