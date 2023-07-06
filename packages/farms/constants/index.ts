import { ChainId } from '@pancakeswap/sdk'
import { isStableFarm, SerializedFarmConfig, supportedChainIdV2 } from '..'

let logged = false

export const getFarmConfig = async (chainId: ChainId) => {
  if (supportedChainIdV2.includes(chainId as number)) {
    try {
      return (await import(`/${chainId}.ts`)).default.filter(
        (f: SerializedFarmConfig) => f.pid !== null,
      ) as SerializedFarmConfig[]
    } catch (error) {
      if (!logged) {
        console.error('Cannot get farm config', error, chainId)
        logged = true
      }
      return []
    }
  }
  return undefined
}

export const getStableConfig = async (chainId: ChainId) => {
  if (supportedChainIdV2.includes(chainId as number)) {
    try {
      const farms = (await import(`/${chainId}.ts`)).default as SerializedFarmConfig[]

      return farms.filter(isStableFarm)
    } catch (error) {
      if (!logged) {
        console.error('Cannot get stable farm config', error, chainId)
        logged = true
      }
      return []
    }
  }
  return undefined
}
