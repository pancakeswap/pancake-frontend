import { AprMap, FarmWithPrices } from '@pancakeswap/farms'

const KV_PREFIX = {
  lp: 'lp:',
  lpApr: 'lpApr:',
  farmByPid: 'farmByPid:',
  farmList: 'farmList:',
  farmV3Liquidity: 'farmV3Liquidity:',
}

export type FarmResult = Array<FarmWithPrices & { cakeApr?: string; lpApr?: number }>

export type FarmV3LiquidityResult = {
  tvl: {
    token0: string
    token1: string
  }
  formatted: {
    token0: string
    token1: string
  }
  updatedAt: string
}

export type SavedFarmResult = {
  updatedAt: string
  poolLength: number
  regularCakePerBlock: number
  data: FarmResult
}

const createKvKey = {
  lp: (chainId: number | string, address: string) => `${KV_PREFIX.lp}${chainId}-${address}`,
  lpAll: (chainId: number | string) => `${KV_PREFIX.lp}:${chainId}all`,
  apr: (chainId: number | string) => `${KV_PREFIX.lpApr}${chainId}`,
  farm: (chainId: number | string, pid: number | string) => `${KV_PREFIX.farmByPid}${chainId}-${pid}`,
  farms: (chainId: number | string) => `${KV_PREFIX.farmList}${chainId}`,
  farmsV3Liquidity: (chainId: number | string, address: string) => `${KV_PREFIX.farmV3Liquidity}${chainId}-${address}`,
}

export class FarmKV {
  static async getFarms(chainId: number | string) {
    return FARMS.get<SavedFarmResult>(createKvKey.farms(chainId), {
      type: 'json',
    })
  }

  static async saveFarms(chainId: number | string, farms: SavedFarmResult) {
    return FARMS.put(createKvKey.farms(chainId), JSON.stringify(farms))
  }

  static async getApr(chainId: number | string) {
    return FARMS.get<AprMap>(createKvKey.apr(chainId), {
      type: 'json',
    })
  }

  // eslint-disable-next-line consistent-return
  static async saveApr(chainId: number | string, aprMap: AprMap | null) {
    const stringifyAprMap = aprMap ? JSON.stringify(aprMap) : null
    if (stringifyAprMap) {
      return FARMS.put(createKvKey.apr(chainId), stringifyAprMap)
    }
  }

  static async getV3Liquidity(chainId: number | string, address: string) {
    return FARMS.get<FarmV3LiquidityResult>(createKvKey.farmsV3Liquidity(chainId, address), {
      type: 'json',
    })
  }

  static async saveV3Liquidity(chainId: number | string, address: string, result: FarmV3LiquidityResult) {
    return FARMS.put(createKvKey.farmsV3Liquidity(chainId, address), JSON.stringify(result))
  }
}
