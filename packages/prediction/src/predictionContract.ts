import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'

export const predictionsBNB: Record<string, Address> = {
  [ChainId.BSC]: '0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA',
  [ChainId.BSC_TESTNET]: '0x',
}

export const predictionsCAKE: Record<string, Address> = {
  [ChainId.BSC]: '0x0E3A8078EDD2021dadcdE733C6b4a86E51EE8f07',
  [ChainId.BSC_TESTNET]: '0x',
}

export const predictionsETH: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.BSC_TESTNET]: '0x',
  [ChainId.ZKSYNC]: '0xaf321b731E65715DdbFDa73A066E00BB28345709',
  [ChainId.ARBITRUM_GOERLI]: '0xd5330586c035a67bd32A6FD8e390c72DB9372861',
}
