import { ChainId } from '@pancakeswap/chains'
import { getGauges } from './constants/config/getGauges'
import { GaugeConfig } from './types'

function createGaugesByChainFetcher() {
  const gaugesByChain: Partial<Record<ChainId, GaugeConfig[]>> = {}

  return async function getGaugesByChain(chainId?: ChainId): Promise<GaugeConfig[]> {
    if (!chainId) return []
    const cache = gaugesByChain[chainId]
    if (cache) return cache
    const gauges = await getGauges()
    const gaugesOnChain = gauges.filter((gauge) => gauge.chainId === chainId)
    gaugesByChain[chainId] = gaugesOnChain
    return gaugesOnChain
  }
}

export const getGaugesByChain = createGaugesByChainFetcher()

export async function safeGetGaugesByChain(chainId?: ChainId) {
  try {
    return await getGaugesByChain(chainId)
  } catch (e) {
    console.error(e)
    return []
  }
}
