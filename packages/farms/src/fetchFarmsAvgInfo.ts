import { ChainId, getChainNameInKebabCase } from '@pancakeswap/chains'
import BN from 'bignumber.js'

import { EXPLORER_API } from './const'

export type FarmAvgInfoRes = {
  [key: string]: AvgInfoRes
}

export type AvgInfoRes = {
  apr24h: string
  apr7d: string
  volumeUSD24h: string
  volumeUSD7d: string
}

export type FarmAvgInfo = {
  [key: string]: AvgInfo
}

export type AvgInfo = {
  apr24h: BN
  apr7d: BN
  volumeUSD24h: BN
  volumeUSD7d: BN
}

export async function fetchV3FarmsAvgInfo(chainId: ChainId): Promise<FarmAvgInfo> {
  const res = await fetch(`${EXPLORER_API}/cached/pools/apr/v3/${getChainNameInKebabCase(chainId)}/farms-lp`)
  const data: FarmAvgInfoRes = await res.json()
  if (!res.ok) {
    throw new Error(`Failed to fetch v3 farms avg info for chain ${chainId}. ${res.status} ${res.statusText}: ${data}`)
  }
  const avgInfos: FarmAvgInfo = {}
  const addresses = Object.keys(data)
  for (const addr of addresses) {
    const info = data[addr]
    if (!info) {
      continue
    }
    avgInfos[addr] = {
      apr24h: new BN(info.apr24h),
      apr7d: new BN(info.apr7d),
      volumeUSD7d: new BN(info.volumeUSD7d),
      volumeUSD24h: new BN(info.volumeUSD24h),
    }
  }
  return avgInfos
}

export async function fetchV2FarmsAvgInfo(chainId: ChainId): Promise<FarmAvgInfo> {
  const res = await fetch(`${EXPLORER_API}/cached/pools/apr/v2/${getChainNameInKebabCase(chainId)}/farms-lp`)
  const data: FarmAvgInfoRes = await res.json()
  if (!res.ok) {
    throw new Error(`Failed to fetch v2 farms avg info for chain ${chainId}. ${res.status} ${res.statusText}: ${data}`)
  }
  const avgInfos: FarmAvgInfo = {}
  const addresses = Object.keys(data)
  for (const addr of addresses) {
    const info = data[addr]
    if (!info) {
      continue
    }
    avgInfos[addr] = {
      apr24h: new BN(info.apr24h),
      apr7d: new BN(info.apr7d),
      volumeUSD7d: new BN(info.volumeUSD7d),
      volumeUSD24h: new BN(info.volumeUSD24h),
    }
  }
  return avgInfos
}

export async function fetchStableFarmsAvgInfo(chainId: ChainId): Promise<FarmAvgInfo> {
  const res = await fetch(`${EXPLORER_API}/cached/pools/apr/stable/${getChainNameInKebabCase(chainId)}/farms-lp`)
  const data: FarmAvgInfoRes = await res.json()
  if (!res.ok) {
    throw new Error(
      `Failed to fetch stable farms avg info for chain ${chainId}. ${res.status} ${res.statusText}: ${data}`,
    )
  }
  const avgInfos: FarmAvgInfo = {}
  const addresses = Object.keys(data)
  for (const addr of addresses) {
    const info = data[addr]
    if (!info) {
      continue
    }
    avgInfos[addr] = {
      apr24h: new BN(info.apr24h),
      apr7d: new BN(info.apr7d),
      volumeUSD7d: new BN(info.volumeUSD7d),
      volumeUSD24h: new BN(info.volumeUSD24h),
    }
  }
  return avgInfos
}
