import { ChainId } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import { GaugeConfig } from './types'
import { CONFIG_PROD } from './constants/config/prod'

export const getGaugesByChain = memoize(
  async (chainId?: ChainId): Promise<GaugeConfig[]> => {
    const result = await CONFIG_PROD()
    return result.filter((gauge) => gauge.chainId === chainId)
  },
  (chainId) => chainId,
)
