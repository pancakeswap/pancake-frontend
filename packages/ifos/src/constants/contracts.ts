import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

import { ProfileSupportedChainId, SupportedChainId } from './supportedChains'

export type ContractAddresses<T extends ChainId = SupportedChainId> = {
  [chainId in T]: Address
}

export const ICAKE = {
  [ChainId.BSC]: '0x3C458828D1622F5f4d526eb0d24Da8C4Eb8F07b1',
  [ChainId.BSC_TESTNET]: '0x5FB0b7a782c2f192493d86922dD3873b6392C8e8',
  [ChainId.GOERLI]: '0xE10d1C0D8bd21D6c3285581aae97091382B8519d',
  [ChainId.POLYGON_ZKEVM]: '0x6ebfF05D15808Ff3065b8e0F71ff541998ebe2e2',
} as const satisfies ContractAddresses<SupportedChainId>

// Used to send cross chain message
// Name derived from smart contract
export const INFO_SENDER = {
  [ChainId.BSC]: '0x63772320a2FA3B9002A863126806b9EeF23e9C81',
  [ChainId.BSC_TESTNET]: '0x204f08c3aA804b2955906664961a73EE4c394e85',
} as const satisfies ContractAddresses<ProfileSupportedChainId>
