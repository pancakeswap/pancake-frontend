import { ChainId } from '@pancakeswap/sdk'
import { SerializedFarmConfig } from '../types'

export const getFarmConfig = async (chainId: ChainId) => {
  try {
    return (await import(`/${chainId}.ts`)).default as SerializedFarmConfig[]
  } catch (error) {
    console.error('Cannot get farm config', error, chainId)
    return []
  }
}
