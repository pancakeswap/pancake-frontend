import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { ChainConfig } from './types'

const WETH_NOT_SUPPORTED_ON_CHAIN = '0x0000000000000000000000000000000000000000'

const CHAIN_CONFIGS: { [key: number]: ChainConfig } = {
  // mainnet
  [ChainId.ETHEREUM]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    creationBlock: 17143817,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  // goerli
  [ChainId.GOERLI]: {
    router: '0xB0A8a4A46786EAd7D60E236e69257Ba27355A3Ae',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    creationBlock: 9758537,
    permit2Address: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  },
  // binance smart chain
  [ChainId.BSC]: {
    router: '0x1A0A18AC4BECDDbd6389559687d1A73d8927E416',
    weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    creationBlock: 27915533,
    permit2Address: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  },
  [ChainId.BSC_TESTNET]: {
    router: '0x4bC641488dd00729ED9dDe94AF53d859b55eDE1c',
    weth: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    creationBlock: 33658520,
    permit2Address: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  },
  // sepolia
  [ChainId.SCROLL_SEPOLIA]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    creationBlock: 3543575,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  // arbitrum
  [ChainId.ARBITRUM_ONE]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    creationBlock: 87206402,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  // arbitrum goerli
  [ChainId.ARBITRUM_GOERLI]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    weth: '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3',
    creationBlock: 18815277,
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  // base goerli
  [ChainId.BASE_TESTNET]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    weth: '0x4200000000000000000000000000000000000006',
    creationBlock: 6915289,
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  // base mainnet
  [ChainId.BASE]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0x4200000000000000000000000000000000000006',
    creationBlock: 1452376,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.POLYGON_ZKEVM]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0x0000000000000000000000000000000000000000',
    creationBlock: 6915289,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.POLYGON_ZKEVM_TESTNET]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    weth: '0x30ec47F7DFae72eA79646e6cf64a8A7db538915b',
    creationBlock: 6915289,
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  [ChainId.LINEA]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0x0000000000000000000000000000000000000000',
    creationBlock: 6915289,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.LINEA_TESTNET]: {
    router: '0x9f3Cb8251492a069dBF0634C24e9De305d6946B8',
    weth: '0x2C1b868d6596a18e32E61B901E4060C872647b6C',
    creationBlock: 6915289,
    permit2Address: '0xCeccEEA1ee8f7420aB5A0daFA56faF39Ee794933',
  },
  [ChainId.OPBNB_TESTNET]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    weth: '0x4200000000000000000000000000000000000006',
    creationBlock: 6915289,
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  [ChainId.ZKSYNC]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    creationBlock: 6915289,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.ZKSYNC_TESTNET]: {
    router: '0x0000000000000000000000000000000000000000',
    weth: '0x02968DB286f24cB18bB5b24903eC8eBFAcf591C0',
    creationBlock: 6915289,
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
}

export const UNIVERSAL_ROUTER_ADDRESS = (chainId: number): Address => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].router
}

export const WETH_ADDRESS = (chainId: number): Address => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)

  if (CHAIN_CONFIGS[chainId].weth == WETH_NOT_SUPPORTED_ON_CHAIN) throw new Error(`Chain ${chainId} does not have WETH`)

  return CHAIN_CONFIGS[chainId].weth
}

export const PERMIT2_ADDRESS = (chainId: number): Address => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].permit2Address
}

export const SENDER_AS_RECIPIENT = '0x0000000000000000000000000000000000000001'
export const ROUTER_AS_RECIPIENT = '0x0000000000000000000000000000000000000002'

export const OPENSEA_CONDUIT_SPENDER_ID = 0
export const SUDOSWAP_SPENDER_ID = 1
