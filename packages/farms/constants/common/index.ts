import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { bscTestnetTokens, bscTokens, ethereumTokens, goerliTestnetTokens } from '@pancakeswap/tokens'

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

export type PriceHelper = {
  chain: string
  list: ERC20Token[]
}

export const priceHelperTokens = {
  [ChainId.ETHEREUM]: {
    chain: 'ethereum',
    list: [ethereumTokens.weth],
  },
  [ChainId.BSC]: {
    chain: 'bsc',
    list: [bscTokens.wbnb, bscTokens.usdc, bscTokens.busd, bscTokens.btcb],
  },
} satisfies Record<number, PriceHelper>

export const DEFAULT_COMMON_PRICE = {
  [ChainId.ETHEREUM]: {},
  [ChainId.GOERLI]: {
    [goerliTestnetTokens.mockA.address]: '10',
  },
  [ChainId.BSC]: {},
  [ChainId.BSC_TESTNET]: {
    [bscTestnetTokens.mockA.address]: '10',
  },
}

export const DEFAULT_STABLE_COINS = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdc, ethereumTokens.usdt],
  [ChainId.GOERLI]: [goerliTestnetTokens.mockB],
  [ChainId.BSC]: [bscTokens.usdc, bscTokens.usdt, bscTokens.busd],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.mockB],
}
