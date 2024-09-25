import { ChainId } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import { GaugeConfig } from './types'
import { GAUGES_CONFIG } from './constants/config'

export const getGaugesByChain = memoize(
  async (chainId?: ChainId): Promise<GaugeConfig[]> =>
    chainId ? (await GAUGES_CONFIG[chainId])?.filter((gauge) => gauge.chainId === chainId) : [],
  (chainId) => chainId,
)
