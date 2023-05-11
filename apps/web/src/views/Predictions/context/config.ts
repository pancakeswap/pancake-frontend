import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION_BNB } from 'config/constants/endpoints'
import { getAddressFromMap } from 'utils/addressHelpers'
import { bscTokens } from '@pancakeswap/tokens'

export default {
  BNB: {
    address: getAddressFromMap(addresses.predictionsBNB),
    api: GRAPH_API_PREDICTION_BNB,
    chainlinkOracleAddress: getAddressFromMap(addresses.chainlinkOracleBNB),
    displayedDecimals: 4,
    token: bscTokens.bnb,
  },
  CAKE: {
    address: getAddressFromMap(addresses.predictionsCAKE),
    api: GRAPH_API_PREDICTION_CAKE,
    chainlinkOracleAddress: getAddressFromMap(addresses.chainlinkOracleCAKE),
    displayedDecimals: 4,
    token: bscTokens.cake,
  },
}
