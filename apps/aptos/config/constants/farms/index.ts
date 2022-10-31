import { SerializedFarmConfig } from '@pancakeswap/farms'

let logged = false

export const getFarmConfig = async (chainId: number) => {
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
