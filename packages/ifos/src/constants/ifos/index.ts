import { ChainId } from '@pancakeswap/sdk'

import { BaseIfoConfig, Ifo } from '../../types'
import { isCrossChainIfoSupportedOnly, isIfoSupported } from '../../utils'
import { CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS } from '../supportedChains'

export async function getIfoConfig(chainId?: ChainId): Promise<Ifo[]> {
  if (!chainId) {
    return []
  }

  try {
    const { ifos } = await import(`./${chainId}`)
    return ifos.map((ifo: BaseIfoConfig) => ({
      ...ifo,
      chainId,
    }))
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getActiveIfo(chainId?: ChainId): Promise<Ifo | null> {
  if (!chainId || !isIfoSupported(chainId)) {
    return null
  }

  const findActiveIfo = (ifos: Ifo[]) => ifos.find(({ isActive }) => isActive) ?? null

  const configs = await getIfoConfig(chainId)
  const activeIfo = findActiveIfo(configs)
  if (activeIfo) {
    return activeIfo
  }

  if (isCrossChainIfoSupportedOnly(chainId)) {
    return null
  }

  // Check if there's cross chain ifo
  const crossChainConfigs = await Promise.all(CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS.map((chain) => getIfoConfig(chain)))
  for (const otherChainConfigs of crossChainConfigs) {
    const active = findActiveIfo(otherChainConfigs)
    if (active) {
      return active
    }
  }
  return null
}
