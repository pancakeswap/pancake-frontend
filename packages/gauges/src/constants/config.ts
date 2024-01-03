import { ChainId } from '@pancakeswap/chains'
import { CONFIG_PROD } from './config/prod'
import { CONFIG_TESTNET } from './config/testnet'

export const GAUGES_CONFIG = {
  [ChainId.BSC]: CONFIG_PROD,
  [ChainId.BSC_TESTNET]: CONFIG_TESTNET,
}
