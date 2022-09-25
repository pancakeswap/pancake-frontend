import { ChainId, Coin } from '@pancakeswap/aptos-swap-sdk'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Coin[]>

export type PageMeta = {
  title: string
  description?: string
  image?: string
}
