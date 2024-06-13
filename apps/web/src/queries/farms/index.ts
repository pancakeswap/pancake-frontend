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

export async function fetchV3FarmsAvgInfo(chainId: ChainId): Promise<FarmAvgInfo> {
  const res = await explorerApiClient.GET('/cached/pools/apr/v3/{chainName}/farms-lp', {
    params: {
      path: {
        chainName: getChainNameInKebabCase(chainId) as any,
      },
    },
  })
  if (!res.response.ok) {
    throw new Error(
      `Failed to fetch v3 farms avg info for chain ${chainId}. ${res.response.status} ${res.response.statusText}: ${res.error}`,
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

export async function fetchV2FarmsAvgInfo(chainId: ChainId): Promise<FarmAvgInfo> {
  const res = await explorerApiClient.GET('/cached/pools/apr/v2/{chainName}/farms-lp', {
    params: {
      path: {
        chainName: getChainNameInKebabCase(chainId) as any,
      },
    },
  })
  if (!res.response.ok) {
    throw new Error(
      `Failed to fetch v2 farms avg info for chain ${chainId}. ${res.response.status} ${res.response.statusText}: ${res.error}`,
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

export async function fetchStableFarmsAvgInfo(chainId: ChainId): Promise<FarmAvgInfo> {
  const res = await explorerApiClient.GET('/cached/pools/apr/v2/{chainName}/farms-lp', {
    params: {
      path: {
        chainName: getChainNameInKebabCase(chainId) as any,
      },
    },
  })
  if (!res.response.ok) {
    throw new Error(
      `Failed to fetch stable farms avg info for chain ${chainId}. ${res.response.status} ${res.response.statusText}: ${res.error}`,
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
