import { ChainId } from '@pancakeswap/chains'
import { CONFIG_PROD } from './prod'
import { CONFIG_TESTNET } from './testnet'

export const GAUGES_CONFIG = {
  [ChainId.BSC]: CONFIG_PROD,
  [ChainId.BSC_TESTNET]: CONFIG_TESTNET,
}
