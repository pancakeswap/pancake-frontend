import { ChainId } from '@pancakeswap/chains'
import { GaugeConfig } from './types'
import { CONFIG_PROD } from './constants/config/prod'

export const getGaugesByChain = async (chainId?: ChainId): Promise<GaugeConfig[]> => {
  const result = await CONFIG_PROD()
  return result.filter((gauge) => gauge.chainId === chainId)
}
