import { ChainId } from '@pancakeswap/chains'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { Address, Hash } from 'viem'
import { ERC20Token } from './entities/token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const FACTORY_ADDRESS = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'

const FACTORY_ADDRESS_ETH = '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362'

export const FACTORY_ADDRESS_MAP = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS_ETH,
  [ChainId.GOERLI]: FACTORY_ADDRESS_ETH,
  [ChainId.BSC]: FACTORY_ADDRESS,
  [ChainId.BSC_TESTNET]: '0x6725F303b657a9451d8BA641348b6761A6CC7a17',
  [ChainId.ARBITRUM_ONE]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.ARBITRUM_GOERLI]: '0x333EAE459075b1d7dE8eb57997b5d4eee5F1070a',
  [ChainId.POLYGON_ZKEVM]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xBA40c83026213F9cbc79998752721a0312bdB74a',
  [ChainId.ZKSYNC]: '0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d',
  [ChainId.ZKSYNC_TESTNET]: '0x48a33610Cd0E130af2024D55F67aE72a8C51aC27',
  [ChainId.LINEA]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.LINEA_TESTNET]: '0xB6FAfd4ADbCd21cF665909767e0eD0D05709abfB',
  [ChainId.OPBNB]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.OPBNB_TESTNET]: '0x776e4bD2f72de2176A59465e316335aaf8ed4E8F',
  [ChainId.BASE]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.BASE_TESTNET]: '0x715303D2eF7dA7FFAbF637651D71FD11d41fAf7F',
  [ChainId.SCROLL_SEPOLIA]: '0x2B3C5df29F73dbF028BA82C33e0A5A6e5800F75e',
  [ChainId.SEPOLIA]: '0x1bdc540dEB9Ed1fA29964DeEcCc524A8f5e2198e',
  [ChainId.ARBITRUM_SEPOLIA]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
  [ChainId.BASE_SEPOLIA]: '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
} as const satisfies Record<ChainId, Address>

export const INIT_CODE_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'

const INIT_CODE_HASH_ETH = '0x57224589c67f3f30a6b0d7a1b54cf3153ab84563bc609ef41dfb34f8b2974d2d'
export const INIT_CODE_HASH_MAP = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH_ETH,
  [ChainId.GOERLI]: INIT_CODE_HASH_ETH,
  [ChainId.BSC]: INIT_CODE_HASH,
  [ChainId.BSC_TESTNET]: '0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66',
  [ChainId.ARBITRUM_ONE]: INIT_CODE_HASH_ETH,
  [ChainId.ARBITRUM_GOERLI]: INIT_CODE_HASH_ETH,
  [ChainId.POLYGON_ZKEVM]: INIT_CODE_HASH_ETH,
  [ChainId.POLYGON_ZKEVM_TESTNET]: INIT_CODE_HASH_ETH,
  [ChainId.ZKSYNC]: '0x0100045707a42494392b3558029b9869f865ff9df8f375dc1bf20b0555093f43',
  [ChainId.ZKSYNC_TESTNET]: '0x0100045707a42494392b3558029b9869f865ff9df8f375dc1bf20b0555093f43',
  [ChainId.LINEA]: INIT_CODE_HASH_ETH,
  [ChainId.LINEA_TESTNET]: INIT_CODE_HASH_ETH,
  [ChainId.OPBNB]: INIT_CODE_HASH_ETH,
  [ChainId.OPBNB_TESTNET]: INIT_CODE_HASH_ETH,
  [ChainId.BASE]: INIT_CODE_HASH_ETH,
  [ChainId.BASE_TESTNET]: '0xa5934690703a592a07e841ca29d5e5c79b5e22ed4749057bb216dc31100be1c0',
  [ChainId.SCROLL_SEPOLIA]: INIT_CODE_HASH_ETH,
  [ChainId.SEPOLIA]: INIT_CODE_HASH_ETH,
  [ChainId.ARBITRUM_SEPOLIA]: INIT_CODE_HASH_ETH,
  [ChainId.BASE_SEPOLIA]: INIT_CODE_HASH_ETH,
} as const satisfies Record<ChainId, Hash>

export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.GOERLI]: new ERC20Token(
    ChainId.GOERLI,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org'
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC,
    '0xE7bCB9e341D546b66a46298f4893f5650a56e99E',
    18,
    'ETH',
    'ETH',
    'https://ethereum.org'
  ),
  [ChainId.ARBITRUM_ONE]: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.ARBITRUM_GOERLI]: new ERC20Token(
    ChainId.ARBITRUM_GOERLI,
    '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(
    ChainId.ZKSYNC_TESTNET,
    '0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.POLYGON_ZKEVM]: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.POLYGON_ZKEVM_TESTNET]: new ERC20Token(
    ChainId.POLYGON_ZKEVM_TESTNET,
    '0x30ec47F7DFae72eA79646e6cf64a8A7db538915b',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.LINEA]: new ERC20Token(
    ChainId.LINEA,
    '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.LINEA_TESTNET]: new ERC20Token(
    ChainId.LINEA_TESTNET,
    '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.OPBNB_TESTNET]: new ERC20Token(
    ChainId.OPBNB_TESTNET,
    '0x584f7b986d9942B0859a1E6921efA5342A673d04',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.OPBNB]: new ERC20Token(
    ChainId.OPBNB,
    '0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea',
    18,
    'ETH',
    'Binance-Peg Ethereum Token',
    'https://ethereum.org'
  ),
  [ChainId.BASE]: new ERC20Token(
    ChainId.BASE,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.BASE_TESTNET]: new ERC20Token(
    ChainId.BASE_TESTNET,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(
    ChainId.SCROLL_SEPOLIA,
    '0x5300000000000000000000000000000000000004',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.ARBITRUM_SEPOLIA]: new ERC20Token(
    ChainId.ARBITRUM_SEPOLIA,
    '0x1bdc540dEB9Ed1fA29964DeEcCc524A8f5e2198e',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
  [ChainId.BASE_SEPOLIA]: new ERC20Token(
    ChainId.BASE_SEPOLIA,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether',
    'https://weth.io'
  ),
}

export const WBNB = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0x418D75f65a02b3D53B2418FB8E1fe493759c7605',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BSC]: new ERC20Token(
    ChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.BSC_TESTNET]: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.OPBNB_TESTNET]: new ERC20Token(
    ChainId.OPBNB_TESTNET,
    '0x4200000000000000000000000000000000000006',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
  ),
  [ChainId.OPBNB]: new ERC20Token(
    ChainId.OPBNB,
    '0x4200000000000000000000000000000000000006',
    18,
    'WBNB',
    'Wrapped BNB',
    'https://www.binance.org'
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
