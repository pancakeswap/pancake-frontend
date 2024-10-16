import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { TokenAddressMap } from '@pancakeswap/token-lists'
import memoize from 'lodash/memoize'
import { multiChainScanName } from 'state/info/constant'
import { Address } from 'viem'
import { bsc } from 'wagmi/chains'
import { checksumAddress } from './checksumAddress'
import { chains } from './wagmi'

export const isAddressEqual = (a?: any, b?: any) => {
  if (!a || !b) return false
  const a_ = safeGetAddress(a)
  if (!a_) return false
  const b_ = safeGetAddress(b)
  if (!b_) return false
  return a_ === b_
}

// returns the checksummed address if the address is valid, otherwise returns undefined
export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value
    if (typeof value === 'string' && !value.startsWith('0x')) {
      value_ = `0x${value}`
    }
    return checksumAddress(value_)
  } catch {
    return undefined
  }
})

export function getBlockExploreLink(
  data: string | number | undefined | null,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || ChainId.BSC
  const chain = chains.find((c) => c.id === chainId)
  if (!chain || !data) return bsc.blockExplorers.default.url
  switch (type) {
    case 'transaction': {
      return `${chain?.blockExplorers?.default.url}/tx/${data}`
    }
    case 'token': {
      return `${chain?.blockExplorers?.default.url}/token/${data}`
    }
    case 'block': {
      return `${chain?.blockExplorers?.default.url}/block/${data}`
    }
    case 'countdown': {
      return `${chain?.blockExplorers?.default.url}/block/countdown/${data}`
    }
    default: {
      return `${chain?.blockExplorers?.default.url}/address/${data}`
    }
  }
}

export function getBlockExploreName(chainIdOverride?: number) {
  const chainId = chainIdOverride || ChainId.BSC
  const chain = chains.find((c) => c.id === chainId)

  return multiChainScanName[chain?.id || -1] || chain?.blockExplorers?.default.name || bsc.blockExplorers.default.name
}

export function getBscScanLinkForNft(collectionAddress: string | undefined, tokenId?: string): string {
  if (!collectionAddress) return ''
  return `${bsc.blockExplorers.default.url}/token/${collectionAddress}?a=${tokenId}`
}

// add 10%
export function calculateGasMargin(value: bigint, margin = 1000n): bigint {
  return (value * (10000n + margin)) / 10000n
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap<ChainId>, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
