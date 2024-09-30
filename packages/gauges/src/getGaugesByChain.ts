import { ChainId } from '@pancakeswap/chains'
import { getGauges } from './constants/config/getGauges'
import { GaugeConfig } from './types'

export const getGaugesByChain = async (chainId?: ChainId): Promise<GaugeConfig[]> => {
  if (!chainId) return []
  const result = await getGauges()
  return result?.[chainId] ?? []
}
