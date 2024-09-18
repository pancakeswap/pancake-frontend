import { ChainId, getChainName } from '@pancakeswap/chains'
import { BaseIfoConfig, Ifo } from '../types'
import { getDestChains } from './getDestChains'
import { isCrossChainIfoSupportedOnly, isIfoSupported } from './isIfoSupported'

export async function getIfoConfig(chainId?: ChainId): Promise<Ifo[]> {
  if (!chainId) {
    return []
  }

  try {
    const { ifos } = await import(`../constants/ifos/${getChainName(chainId)}`)
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
  const crossChainConfigs = await Promise.all((getDestChains(chainId) || []).map((chain) => getIfoConfig(chain)))
  for (const otherChainConfigs of crossChainConfigs) {
    const active = findActiveIfo(otherChainConfigs)
    if (active) {
      return active
    }
  }
  return null
}

export async function getInActiveIfos(chainId?: ChainId): Promise<Ifo[]> {
  if (!chainId || !isIfoSupported(chainId)) {
    return []
  }

  const configs = await getIfoConfig(chainId)
  return configs.filter(({ isActive }) => !isActive)
}

export async function getTotalIFOSold(chainId?: ChainId): Promise<number> {
  const ifos = await getIfoConfig(chainId)
  const unwrap = (usd: string) => {
    return Number(usd.replace(/[$,]/g, ''))
  }
  return ifos.reduce((acc, current) => {
    if (current.poolBasic?.raiseAmount) {
      return acc + unwrap(current.poolBasic.raiseAmount)
    }
    if (current.poolUnlimited?.raiseAmount) {
      return acc + unwrap(current.poolUnlimited.raiseAmount)
    }
    return acc
  }, 0)
}
