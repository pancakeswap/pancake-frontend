import { ChainId } from '@pancakeswap/chains'
import { Percent } from '@pancakeswap/swap-sdk-core'

import { ERC20Token } from './entities/erc20Token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.GOERLI]: new ERC20Token(
    ChainId.GOERLI,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org',
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC,
    '0xE7bCB9e341D546b66a46298f4893f5650a56e99E',
    18,
    'ETH',
    'ETH',
    'https://ethereum.org',
  ),
  [ChainId.ARBITRUM_ONE]: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.ARBITRUM_GOERLI]: new ERC20Token(
    ChainId.ARBITRUM_GOERLI,
    '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(
    ChainId.ZKSYNC_TESTNET,
    '0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.POLYGON_ZKEVM]: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.POLYGON_ZKEVM_TESTNET]: new ERC20Token(
    ChainId.POLYGON_ZKEVM_TESTNET,
    '0x30ec47F7DFae72eA79646e6cf64a8A7db538915b',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.LINEA]: new ERC20Token(
    ChainId.LINEA,
    '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.LINEA_TESTNET]: new ERC20Token(
    ChainId.LINEA_TESTNET,
    '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.OPBNB_TESTNET]: new ERC20Token(
    ChainId.OPBNB_TESTNET,
    '0x584f7b986d9942B0859a1E6921efA5342A673d04',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.OPBNB]: new ERC20Token(
    ChainId.OPBNB,
    '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org',
  ),
  [ChainId.BASE]: new ERC20Token(
    ChainId.BASE,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.BASE_TESTNET]: new ERC20Token(
    ChainId.BASE_TESTNET,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(
    ChainId.SCROLL_SEPOLIA,
    '0x5300000000000000000000000000000000000004',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.ARBITRUM_SEPOLIA]: new ERC20Token(
    ChainId.ARBITRUM_SEPOLIA,
    '0x1bdc540dEB9Ed1fA29964DeEcCc524A8f5e2198e',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
  [ChainId.BASE_SEPOLIA]: new ERC20Token(
    ChainId.BASE_SEPOLIA,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io',
  ),
}

export const WBNB = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0x418D75f65a02b3D53B2418FB8E1fe493759c7605',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org',
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org',
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org',
  ),
  [ChainId.OPBNB_TESTNET]: new ERC20Token(
    ChainId.OPBNB_TESTNET,
    '0x4200000000000000000000000000000000000006',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org',
  ),
  [ChainId.OPBNB]: new ERC20Token(
    ChainId.OPBNB,
    '0x4200000000000000000000000000000000000006',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org',
  ),
}

export const WNATIVE = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
  [ChainId.GOERLI]: WETH9[ChainId.GOERLI],
  [ChainId.BSC]: WBNB[ChainId.BSC],
  [ChainId.BSC_TESTNET]: WBNB[ChainId.BSC_TESTNET],
  [ChainId.ARBITRUM_ONE]: WETH9[ChainId.ARBITRUM_ONE],
  [ChainId.ARBITRUM_GOERLI]: WETH9[ChainId.ARBITRUM_GOERLI],
  [ChainId.POLYGON_ZKEVM]: WETH9[ChainId.POLYGON_ZKEVM],
  [ChainId.POLYGON_ZKEVM_TESTNET]: WETH9[ChainId.POLYGON_ZKEVM_TESTNET],
  [ChainId.ZKSYNC]: WETH9[ChainId.ZKSYNC],
  [ChainId.ZKSYNC_TESTNET]: WETH9[ChainId.ZKSYNC_TESTNET],
  [ChainId.LINEA]: WETH9[ChainId.LINEA],
  [ChainId.LINEA_TESTNET]: WETH9[ChainId.LINEA_TESTNET],
  [ChainId.OPBNB_TESTNET]: WBNB[ChainId.OPBNB_TESTNET],
  [ChainId.OPBNB]: WBNB[ChainId.OPBNB],
  [ChainId.BASE]: WETH9[ChainId.BASE],
  [ChainId.BASE_TESTNET]: WETH9[ChainId.BASE_TESTNET],
  [ChainId.SCROLL_SEPOLIA]: WETH9[ChainId.SCROLL_SEPOLIA],
  [ChainId.SEPOLIA]: WETH9[ChainId.SEPOLIA],
  [ChainId.ARBITRUM_SEPOLIA]: WETH9[ChainId.ARBITRUM_SEPOLIA],
  [ChainId.BASE_SEPOLIA]: WETH9[ChainId.BASE_SEPOLIA],
} satisfies Record<ChainId, ERC20Token>

const ETHER = { name: 'Ether', symbol: 'ETH', decimals: 18 } as const

const BNB = {
  name: 'Binance Chain Native Token',
  symbol: 'BNB',
  decimals: 18,
} as const

export const NATIVE = {
  [ChainId.ETHEREUM]: ETHER,
  [ChainId.GOERLI]: { name: 'Goerli Ether', symbol: 'GOR', decimals: 18 },
  [ChainId.BSC]: BNB,
  [ChainId.BSC_TESTNET]: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  [ChainId.ARBITRUM_ONE]: ETHER,
  [ChainId.ARBITRUM_GOERLI]: {
    name: 'Arbitrum Goerli Ether',
    symbol: 'AGOR',
    decimals: 18,
  },
  [ChainId.POLYGON_ZKEVM]: ETHER,
  [ChainId.POLYGON_ZKEVM_TESTNET]: ETHER,
  [ChainId.ZKSYNC]: ETHER,
  [ChainId.ZKSYNC_TESTNET]: ETHER,
  [ChainId.LINEA]: ETHER,
  [ChainId.LINEA_TESTNET]: ETHER,
  [ChainId.OPBNB]: BNB,
  [ChainId.OPBNB_TESTNET]: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  [ChainId.BASE]: ETHER,
  [ChainId.BASE_TESTNET]: ETHER,
  [ChainId.SCROLL_SEPOLIA]: ETHER,
  [ChainId.SEPOLIA]: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  [ChainId.BASE_SEPOLIA]: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
} satisfies Record<
  ChainId,
  {
    name: string
    symbol: string
    decimals: number
  }
>
