import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE, GRAPH_API_PREDICTION } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'

export default {
  BNB: {
    address: getAddress(addresses.predictions),
    api: GRAPH_API_PREDICTION,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracle),
    token: tokens.bnb,
  },
  CAKE: {
    address: getAddress(addresses.predictionsCAKE),
    api: GRAPH_API_PREDICTION_CAKE,
    chainlinkOracleAddress: getAddress(addresses.chainlinkOracleCAKE),
    token: tokens.cake,
  },
}
