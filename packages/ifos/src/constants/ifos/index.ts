import { ChainId } from '@pancakeswap/sdk'

import { Ifo } from '../../types'
import { isCrossChainIfoSupportedOnly, isIfoSupported } from '../../utils'
import { CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS } from '../supportedChains'

export async function getIfoConfig(chainId?: ChainId): Promise<Ifo[]> {
  if (!chainId) {
    return []
  }

  try {
    const { ifos } = await import(`./${chainId}`)
    return ifos
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getActiveIfo(chainId?: ChainId): Promise<{ ifo: Ifo; chainId: ChainId } | null> {
  if (!chainId || !isIfoSupported(chainId)) {
    return null
  }

  const findActiveIfo = (ifos: Ifo[]) => ifos.find(({ isActive }) => isActive) ?? null

  const configs = await getIfoConfig(chainId)
  const activeIfo = findActiveIfo(configs)
  if (activeIfo) {
    return {
      ifo: activeIfo,
      chainId,
    }
  }

  if (isCrossChainIfoSupportedOnly(chainId)) {
    return null
  }

  // Check if there's cross chain ifo
  const crossChainConfigs = await Promise.all(CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS.map((chain) => getIfoConfig(chain)))
  for (const [index, otherChainConfigs] of crossChainConfigs.entries()) {
    const active = findActiveIfo(otherChainConfigs)
    if (active) {
      return {
        ifo: active,
        chainId: CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS[index],
      }
    }
  }
  return null
}
