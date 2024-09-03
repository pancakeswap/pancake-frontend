import { ChainId, getChainName } from '@pancakeswap/chains'
import { SerializedFarmConfig, SerializedFarmPublicData, isStableFarm, supportedChainIdV2 } from '..'

let logged = false

/**
 * @deprecated
 */
export const getFarmConfig = async (chainId?: ChainId) => {
  if (chainId && supportedChainIdV2.includes(chainId as number)) {
    const chainName = getChainName(chainId)
    try {
      const d = (await import(`./${chainName}.ts`)).default.filter(
        (f: SerializedFarmPublicData) => f.pid !== null,
      ) as SerializedFarmPublicData[]

      return d
    } catch (error) {
      if (!logged) {
        console.error('Cannot get farm config', error, chainId, chainName)
        logged = true
      }
      return []
    }
  }
  return undefined
}

export const getStableConfig = async (chainId: ChainId) => {
  if (supportedChainIdV2.includes(chainId as number)) {
    const chainName = getChainName(chainId)
    try {
      const farms = (await import(`/${chainName}.ts`)).default as SerializedFarmConfig[]

      return farms.filter(isStableFarm)
    } catch (error) {
      if (!logged) {
        console.error('Cannot get stable farm config', error, chainId, chainName)
        logged = true
      }
      return []
    }
  }
  return undefined
}
