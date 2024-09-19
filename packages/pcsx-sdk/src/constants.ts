import { ChainId } from '@pancakeswap/chains'
import { getPermit2Address } from '@pancakeswap/permit2-sdk'
import type { Address } from 'viem'

export const SupportedChainId = [
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.SEPOLIA,
  ChainId.ARBITRUM_ONE,
  ChainId.ETHEREUM,
] as const

export type XSupportedChainId = (typeof SupportedChainId)[number]

export const PERMIT2_MAPPING = {
  [ChainId.BSC]: getPermit2Address(ChainId.BSC),
  [ChainId.BSC_TESTNET]: getPermit2Address(ChainId.BSC_TESTNET),
  [ChainId.SEPOLIA]: getPermit2Address(ChainId.SEPOLIA),
  [ChainId.ARBITRUM_ONE]: getPermit2Address(ChainId.ARBITRUM_ONE),
  [ChainId.ETHEREUM]: getPermit2Address(ChainId.ETHEREUM),
} as const satisfies Record<XSupportedChainId, Address | undefined>

export const ORDER_QUOTER_MAPPING = {
  [ChainId.BSC]: '0x369B57fE0Fab4d5a110e4F02b871979DE0300C18',
  [ChainId.BSC_TESTNET]: '0x6f73C295E70Cd87307dD73c4730c685Bb977bB70',
  [ChainId.SEPOLIA]: '0x180415ddfBeD6bf9a6C0fcE0EB23DE60B0157f58',
  [ChainId.ARBITRUM_ONE]: '0xF812A85c70b05Df76ff3bC802c0244307033Ccd0',
  [ChainId.ETHEREUM]: '0xF812A85c70b05Df76ff3bC802c0244307033Ccd0',
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
  [ChainId.SEPOLIA]: {
    [OrderType.ExclusiveDutchOrder]: '0xbfCC755375250C1EA9722EB1B8d97076f681627C',
  },
  [ChainId.ARBITRUM_ONE]: {
    [OrderType.ExclusiveDutchOrder]: '0x35db01D1425685789dCc9228d47C7A5C049388d8',
  },
  [ChainId.ETHEREUM]: {
    [OrderType.ExclusiveDutchOrder]: '0x35db01D1425685789dCc9228d47C7A5C049388d8',
  },
} as const satisfies ReactorMapping
