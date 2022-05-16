import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION } from 'config/constants/endpoints'
import { getAddress } from 'utils/addressHelpers'
import { PredictionConfig } from 'state/types'
import tokens from 'config/constants/tokens'

import configProviderFactory from './configProviderFactory'

export const config: PredictionConfig = {
  address: getAddress(addresses.predictions),
  api: GRAPH_API_PREDICTION,
  chainlinkOracleAddress: getAddress(addresses.chainlinkOracle),
  token: tokens.bnb,
}

export default configProviderFactory(config)
