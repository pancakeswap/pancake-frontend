import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { SupportedChainId } from './constants/supportedChains'
import { ContractAddresses } from './type'

export const predictionsBNB: Record<string, Address> = {
  [ChainId.BSC]: '0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const predictionsCAKE: Record<string, Address> = {
  [ChainId.BSC]: '0x0E3A8078EDD2021dadcdE733C6b4a86E51EE8f07',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const predictionsETH: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.ZKSYNC]: '0x43c7771DEB958A2e3198ED98772056ba70DaA84c',
  [ChainId.ARBITRUM_ONE]: '0x1cdc19B13729f16C5284a0ACE825F83fC9d799f4',
} as const satisfies ContractAddresses<SupportedChainId>

export const predictionsWBTC: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>
