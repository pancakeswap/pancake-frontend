import { ChainId, getChainNameInKebabCase } from '@pancakeswap/chains'
import BN from 'bignumber.js'

import { explorerApiClient } from 'state/info/api/client'

export type FarmAvgInfoRes = {
  [key: string]: AvgInfoRes
}

export type AvgInfoRes = {
  apr7d: string
  volumeUSD7d: string
}

export type FarmAvgInfo = {
  [key: string]: AvgInfo
}

export type AvgInfo = {
  apr7d: BN
  volumeUSD7d: BN
}

function createGeneralFarmsAvgInfoFetcher(
  apiPath:
    | '/cached/pools/apr/v3/{chainName}/farms-lp'
    | '/cached/pools/apr/v2/{chainName}/farms-lp'
    | '/cached/pools/apr/stable/{chainName}/farms-lp',
) {
  return async function fetchFarmsAvgInfo(chainId: ChainId) {
    const res = await explorerApiClient.GET(apiPath, {
      params: {
        path: {
          chainName: getChainNameInKebabCase(chainId) as any,
        },
      },
    })
    if (!res.response.ok) {
      throw new Error(
        `Failed to fetch ${apiPath} for chain ${chainId}. ${res.response.status} ${res.response.statusText}: ${res.error}`,
      )
    }
    const data = res.data as FarmAvgInfoRes
    const avgInfos: FarmAvgInfo = {}
    const addresses = Object.keys(data)
    for (const addr of addresses) {
      const info = data[addr]
      if (!info) {
        continue
      }
      avgInfos[addr] = {
        apr7d: new BN(info.apr7d),
        volumeUSD7d: new BN(info.volumeUSD7d),
      }
    }
    return avgInfos
  }
}

export const fetchV3FarmsAvgInfo = createGeneralFarmsAvgInfoFetcher('/cached/pools/apr/v3/{chainName}/farms-lp')

export const fetchV2FarmsAvgInfo = createGeneralFarmsAvgInfoFetcher('/cached/pools/apr/v2/{chainName}/farms-lp')

export const fetchStableFarmsAvgInfo = createGeneralFarmsAvgInfoFetcher('/cached/pools/apr/stable/{chainName}/farms-lp')
