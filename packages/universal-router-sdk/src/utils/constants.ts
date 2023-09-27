import { ChainId } from '@pancakeswap/chains'
import { ChainConfig } from './types'

const WETH_NOT_SUPPORTED_ON_CHAIN = '0x0000000000000000000000000000000000000000'

const CHAIN_CONFIGS: { [key: number]: ChainConfig } = {
  // mainnet
  [ChainId.ETHEREUM]: {
    router: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    creationBlock: 17143817,
  },
  // goerli
  [ChainId.GOERLI]: {
    router: '0xB0A8a4A46786EAd7D60E236e69257Ba27355A3Ae',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    creationBlock: 9758537,
  },
  // binance smart chain
  [ChainId.BSC]: {
    router: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    creationBlock: 27915533,
  },
  [ChainId.BSC_TESTNET]: {
    router: '0x4bC641488dd00729ED9dDe94AF53d859b55eDE1c',
    weth: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    creationBlock: 33658520,
  },
  // sepolia
  [ChainId.SCROLL_SEPOLIA]: {
    router: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    weth: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    creationBlock: 3543575,
  },
  // arbitrum
  [ChainId.ARBITRUM_ONE]: {
    router: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    creationBlock: 87206402,
  },
  // arbitrum goerli
  [ChainId.ARBITRUM_GOERLI]: {
    router: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    weth: '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3',
    creationBlock: 18815277,
  },
  // base goerli
  [ChainId.BASE_TESTNET]: {
    router: '0xD0872D928672ae2fF74Bdb2F5130Ac12229CAfAF',
    weth: '0x4200000000000000000000000000000000000006',
    creationBlock: 6915289,
  },
  // base mainnet
  [ChainId.BASE]: {
    router: '0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC',
    weth: '0x4200000000000000000000000000000000000006',
    creationBlock: 1452376,
  },
}

export const UNIVERSAL_ROUTER_ADDRESS = (chainId: number): string => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].router
}

export const WETH_ADDRESS = (chainId: number): string => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)

  if (CHAIN_CONFIGS[chainId].weth == WETH_NOT_SUPPORTED_ON_CHAIN) throw new Error(`Chain ${chainId} does not have WETH`)

  return CHAIN_CONFIGS[chainId].weth
}

export const PERMIT2_ADDRESS = '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768'

export const SENDER_AS_RECIPIENT = '0x0000000000000000000000000000000000000001'
export const ROUTER_AS_RECIPIENT = '0x0000000000000000000000000000000000000002'

export const OPENSEA_CONDUIT_SPENDER_ID = 0
export const SUDOSWAP_SPENDER_ID = 1
