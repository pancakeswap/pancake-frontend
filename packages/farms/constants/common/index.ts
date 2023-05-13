import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { bscTestnetTokens, bscTokens, ethereumTokens, goerliTestnetTokens } from '@pancakeswap/tokens'
import type { CommonPrice } from '../../src/fetchFarmsV3'

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

export type PriceHelper = {
  chain: string
  list: ERC20Token[]
}

export const priceHelperTokens = {
  [ChainId.ETHEREUM]: {
    chain: 'ethereum',
    list: [ethereumTokens.weth, ethereumTokens.usdc, ethereumTokens.usdt],
  },
  [ChainId.BSC]: {
    chain: 'bsc',
    list: [bscTokens.wbnb, bscTokens.usdt, bscTokens.busd, bscTokens.eth],
  },
} satisfies Record<number, PriceHelper>

// for testing purposes
export const DEFAULT_COMMON_PRICE: Record<ChainId, CommonPrice> = {
  [ChainId.ETHEREUM]: {},
  [ChainId.GOERLI]: {
    [goerliTestnetTokens.mockA.address]: '10',
  },
  [ChainId.BSC]: {},
  [ChainId.BSC_TESTNET]: {
    [bscTestnetTokens.mockA.address]: '10',
    [bscTestnetTokens.usdt.address]: '1',
    [bscTestnetTokens.busd.address]: '1',
    [bscTestnetTokens.usdc.address]: '1',
  },
}
