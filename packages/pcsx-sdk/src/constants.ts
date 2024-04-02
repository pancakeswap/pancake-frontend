import { ChainId } from '@pancakeswap/chains'
import type { Address } from 'viem'
import { getPermit2Address } from '@pancakeswap/permit2-sdk'

export const SupportedChainId = [ChainId.ETHEREUM, ChainId.BSC, ChainId.BSC_TESTNET] as const

export type XSupportedChainId = (typeof SupportedChainId)[number]

export const PERMIT2_MAPPING = {
  [ChainId.ETHEREUM]: getPermit2Address(ChainId.ETHEREUM),
  [ChainId.BSC]: getPermit2Address(ChainId.BSC),
  [ChainId.BSC_TESTNET]: getPermit2Address(ChainId.BSC_TESTNET),
} as const satisfies Record<XSupportedChainId, Address>

export const ORDER_QUOTER_MAPPING = {
  [ChainId.ETHEREUM]: '0x54539967a06Fc0E3C3ED0ee320Eb67362D13C5fF',
  [ChainId.BSC]: '0xF812A85c70b05Df76ff3bC802c0244307033Ccd0',
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
  [ChainId.ETHEREUM]: {
    [OrderType.ExclusiveDutchOrder]: '0x6000da47483062A0D734Ba3dc7576Ce6A0B645C4',
  },
  [ChainId.BSC]: {
    [OrderType.ExclusiveDutchOrder]: '0x003BcEe8ca3e9B94aF07964F45e104FE0D68fD8C',
  },
  [ChainId.BSC_TESTNET]: {
    [OrderType.ExclusiveDutchOrder]: '0xCfe2a565072f85381775Eb12644d297bf0F66773',
  },
} as const satisfies ReactorMapping
