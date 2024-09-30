import { ChainId } from '@pancakeswap/chains'
import { getGauges } from './constants/config/getGauges'
import { GaugeConfig } from './types'

export const getGaugesByChain = async (chainId?: ChainId): Promise<GaugeConfig[]> => {
  const result = await getGauges()
  return result.filter((gauge) => gauge.chainId === chainId)
}
