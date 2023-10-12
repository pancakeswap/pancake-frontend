import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { ChainConfig } from '../entities/types'

const CHAIN_CONFIGS: { [key: number]: ChainConfig } = {
  // mainnet
  [ChainId.ETHEREUM]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  // goerli
  [ChainId.GOERLI]: {
    router: '0xC46abF8B66Df4B9Eb0cC0cf6eba24226AC6E6285',
    permit2Address: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  },
  // binance smart chain
  [ChainId.BSC]: {
    router: '0x1A0A18AC4BECDDbd6389559687d1A73d8927E416',
    permit2Address: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  },
  [ChainId.BSC_TESTNET]: {
    router: '0x9A082015c919AD0E47861e5Db9A1c7070E81A2C7',
    permit2Address: '0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768',
  },
  // sepolia
  [ChainId.SCROLL_SEPOLIA]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  // arbitrum
  [ChainId.ARBITRUM_ONE]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  // arbitrum goerli
  [ChainId.ARBITRUM_GOERLI]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  // base goerli
  [ChainId.BASE_TESTNET]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  // base mainnet
  [ChainId.BASE]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.POLYGON_ZKEVM]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.POLYGON_ZKEVM_TESTNET]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  [ChainId.LINEA]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.LINEA_TESTNET]: {
    router: '0x9f3Cb8251492a069dBF0634C24e9De305d6946B8',
    permit2Address: '0xCeccEEA1ee8f7420aB5A0daFA56faF39Ee794933',
  },
  [ChainId.OPBNB_TESTNET]: {
    router: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
    permit2Address: '0xCaCC5DF33e3AF664158eaaB87bc8f282C674ec25',
  },
  [ChainId.ZKSYNC]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.ZKSYNC_TESTNET]: {
    router: '0x0000000000000000000000000000000000000000',
    permit2Address: '0x0000000000000000000000000000000000000000',
  },
}

export const getUniversalRouterAddress = (chainId: ChainId): Address => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].router
}

export const getPermit2Address = (chainId: ChainId): Address => {
  if (!(chainId in CHAIN_CONFIGS)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return CHAIN_CONFIGS[chainId].permit2Address
}

export const CONTRACT_BALANCE = 2n ** 255n
export const SENDER_AS_RECIPIENT = '0x0000000000000000000000000000000000000001'
export const ROUTER_AS_RECIPIENT = '0x0000000000000000000000000000000000000002'

export const OPENSEA_CONDUIT_SPENDER_ID = 0
export const SUDOSWAP_SPENDER_ID = 1

export const SIGNATURE_LENGTH = 65
export const EIP_2098_SIGNATURE_LENGTH = 64
