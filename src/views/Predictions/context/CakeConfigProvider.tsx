import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_CAKE } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { PredictionConfig } from 'state/types'
import tokens from 'config/constants/tokens'

import configProviderFactory from './configProviderFactory'

export const config: PredictionConfig = {
  address: getAddress(addresses.predictionsCAKE),
  api: GRAPH_API_PREDICTION_CAKE,
  chainlinkOracleAddress: getAddress(addresses.chainlinkOracleCAKE),
  token: tokens.cake,
}

export default configProviderFactory(config)
