import { ChainId } from '@pancakeswap/chains'
import type { Address } from 'viem'
import { getPermit2Address } from '@pancakeswap/permit2-sdk'

export const SupportedChainId = [ChainId.BSC, ChainId.BSC_TESTNET] as const

export type XSupportedChainId = (typeof SupportedChainId)[number]

export const PERMIT2_MAPPING = {
  [ChainId.BSC]: getPermit2Address(ChainId.BSC),
  [ChainId.BSC_TESTNET]: getPermit2Address(ChainId.BSC_TESTNET),
} as const satisfies Record<XSupportedChainId, Address | undefined>

export const ORDER_QUOTER_MAPPING = {
  [ChainId.BSC]: '0x369B57fE0Fab4d5a110e4F02b871979DE0300C18',
  [ChainId.BSC_TESTNET]: '0x6f73C295E70Cd87307dD73c4730c685Bb977bB70',
} as const satisfies Record<XSupportedChainId, Address>

export enum OrderType {
  ExclusiveDutchOrder = 'ExclusiveDutchOrder',
}

export type Reactors = {
  [key in OrderType]: Address
}

type ReactorMapping = { readonly [key in XSupportedChainId]: Reactors }

export const REACTOR_ADDRESS_MAPPING = {
  [ChainId.BSC]: {
    [OrderType.ExclusiveDutchOrder]: '0xDB9D365b50E62fce747A90515D2bd1254A16EbB9',
  },
  [ChainId.BSC_TESTNET]: {
    [OrderType.ExclusiveDutchOrder]: '0xCfe2a565072f85381775Eb12644d297bf0F66773',
  },
} as const satisfies ReactorMapping
