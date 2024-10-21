import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

const UNIVERSAL_ROUTER_ADDRESSES: Record<ChainId, Address> = {
  [ChainId.ETHEREUM]: '0x65b382653f7C31bC0Af67f188122035461ec9C76',
  [ChainId.GOERLI]: '0xC46abF8B66Df4B9Eb0cC0cf6eba24226AC6E6285',
  [ChainId.SEPOLIA]: '0x6A3d58cc25a92d90Fa3a8f0f5d5e75AD01ccd7a6',

  [ChainId.BSC]: '0x1A0A18AC4BECDDbd6389559687d1A73d8927E416',
  [ChainId.BSC_TESTNET]: '0x7a7F562aCEb6e6352ee2FF93aeFb1051d4A1511A',

  // [ChainId.SCROLL]: '0xB89a6778D1efE7a5b7096757A21b810CC2886fa1',
  [ChainId.SCROLL_SEPOLIA]: '0xB89a6778D1efE7a5b7096757A21b810CC2886fa1',

  [ChainId.ARBITRUM_ONE]: '0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912',
  [ChainId.ARBITRUM_GOERLI]: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
  [ChainId.ARBITRUM_SEPOLIA]: '0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912',

  [ChainId.BASE]: '0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912',
  [ChainId.BASE_TESTNET]: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
  [ChainId.BASE_SEPOLIA]: '0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912',

  [ChainId.POLYGON_ZKEVM]: '0xB89a6778D1efE7a5b7096757A21b810CC2886fa1',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xa8EEA7aa6620712524d18D742821848e55E773B5',

  [ChainId.LINEA]: '0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912',
  [ChainId.LINEA_TESTNET]: '0x9f3Cb8251492a069dBF0634C24e9De305d6946B8',

  [ChainId.ZKSYNC]: '0xdAee41E335322C85ff2c5a6745c98e1351806e98',
  [ChainId.ZKSYNC_TESTNET]: '0xCa97D1FAFCEa54EFc68d66eA914AB2F8Fbfe93c5',

  [ChainId.OPBNB]: '0xB89a6778D1efE7a5b7096757A21b810CC2886fa1',
  [ChainId.OPBNB_TESTNET]: '0xa8EEA7aa6620712524d18D742821848e55E773B5',
}

export const getUniversalRouterAddress = (chainId: ChainId): Address => {
  if (!(chainId in UNIVERSAL_ROUTER_ADDRESSES)) throw new Error(`Universal Router not deployed on chain ${chainId}`)
  return UNIVERSAL_ROUTER_ADDRESSES[chainId]
}

export const CONTRACT_BALANCE = 2n ** 255n
export const SENDER_AS_RECIPIENT = '0x0000000000000000000000000000000000000001'
export const ROUTER_AS_RECIPIENT = '0x0000000000000000000000000000000000000002'

// export const OPENSEA_CONDUIT_SPENDER_ID = 0
// export const SUDOSWAP_SPENDER_ID = 1

export const SIGNATURE_LENGTH = 65
export const EIP_2098_SIGNATURE_LENGTH = 64
