import { ChainId } from '@pancakeswap/chains'
import { GaugeConfig } from '../../types'
import { CONFIG_PROD } from './prod'
import { CONFIG_TESTNET } from './testnet'

export const GAUGES_CONFIG: { [key: string]: Promise<GaugeConfig[]> } = {
  [ChainId.BSC]: Promise.resolve(CONFIG_PROD()),
  [ChainId.BSC_TESTNET]: Promise.resolve(CONFIG_TESTNET),
}
