import { ChainId } from '@pancakeswap/chains'
import { Currency } from '@pancakeswap/sdk'
import { TokenAddressMap } from '@pancakeswap/token-lists'
import memoize from 'lodash/memoize'
import { Address, keccak256, stringToBytes } from 'viem'
import { bsc } from 'wagmi/chains'
import { chains } from './wagmi'

export const isAddressEqual = (a?: any, b?: any) => {
  if (!a || !b) return false
  const a_ = safeGetAddress(a)
  if (!a_) return false
  const b_ = safeGetAddress(b)
  if (!b_) return false
  return a_ === b_
}

export function checksumAddress(address_: Address): Address {
  const hexAddress = address_.substring(2).toLowerCase()
  const hash = keccak256(stringToBytes(hexAddress), 'bytes')

  const address = hexAddress.split('')
  for (let i = 0; i < 40; i += 2) {
    // eslint-disable-next-line no-bitwise
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase()
    }
    // eslint-disable-next-line no-bitwise
    if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase()
    }
  }

  const result = `0x${address.join('')}` as const
  return result
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

  return chain?.blockExplorers?.default.name || bsc.blockExplorers.default.name
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
