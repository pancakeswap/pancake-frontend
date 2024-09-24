import { ChainId } from '@pancakeswap/chains'
import { GaugeConfig } from '../../types'
import { CONFIG_PROD } from './prod'
import { CONFIG_TESTNET } from './testnet'

export const GAUGES_CONFIG: { [key: string]: GaugeConfig[] } = {
  [ChainId.BSC]: [],
  [ChainId.BSC_TESTNET]: CONFIG_TESTNET,
}

const initGaugesConfig = () => {
  CONFIG_PROD()
    .then((prodConfig) => {
      GAUGES_CONFIG[ChainId.BSC] = prodConfig
    })
    .catch((error) => {
      console.error('Failed to initialize GAUGES_CONFIG:', error)
    })
}

initGaugesConfig()
