import { ChainId } from '@pancakeswap/chains'
import set from 'lodash/set'
import { fetchUniversalFarms } from '../fetchUniversalFarms'
import { UniversalFarmConfig } from '../types'

// import { arbFarmConfig } from './arb'
// import { baseFarmConfig } from './base'
// import { bscFarmConfig } from './bsc'
// import { ethereumFarmConfig } from './eth'
// import { lineaFarmConfig } from './linea'
// import { opBNBFarmConfig } from './opBNB'
// import { polygonZkEVMFarmConfig } from './polygonZkEVM'
// import { zkSyncFarmConfig } from './zkSync'

const chainIds: ChainId[] = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
  ChainId.ARBITRUM_ONE,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.OPBNB,
]

export const fetchAllUniversalFarms = async (): Promise<UniversalFarmConfig[]> => {
  try {
    const farmPromises = chainIds.map((chainId) => fetchUniversalFarms(chainId))
    const allFarms = await Promise.all(farmPromises)
    const combinedFarms = allFarms.flat()

    return combinedFarms
  } catch (error) {
    console.error('Failed to fetch universal farms:', error)
    return []
  }
}

export const fetchAllUniversalFarmsMap = async (): Promise<Record<string, UniversalFarmConfig>> => {
  try {
    const farmConfig = await fetchAllUniversalFarms()

    return farmConfig.reduce((acc, farm) => {
      set(acc, `${farm.chainId}:${farm.lpAddress}`, farm)
      return acc
    }, {} as Record<string, UniversalFarmConfig>)
  } catch (error) {
    console.error('Failed to fetch universal farms map:', error)
    return {}
  }
}
