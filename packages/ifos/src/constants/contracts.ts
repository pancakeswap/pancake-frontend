import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

import { ProfileSupportedChainId, SupportedChainId } from './supportedChains'

export type ContractAddresses<T extends ChainId = SupportedChainId> = {
  [chainId in T]: Address
}

export const ICAKE = {
  [ChainId.BSC]: '0x9C46110Eb094866922045729AEFcdff91f2CFFF5',
  [ChainId.BSC_TESTNET]: '0x5FB0b7a782c2f192493d86922dD3873b6392C8e8',
  [ChainId.GOERLI]: '0x45A33F911F9E2ea404303920E9775467518a4ed7',
  // [ChainId.POLYGON_ZKEVM]: '0x6ebfF05D15808Ff3065b8e0F71ff541998ebe2e2',
} as const satisfies ContractAddresses<SupportedChainId>

// Used to send cross chain message
// Name derived from smart contract
export const INFO_SENDER = {
  [ChainId.BSC]: '0x63772320a2FA3B9002A863126806b9EeF23e9C81',
  [ChainId.BSC_TESTNET]: '0x4Dc3E0a7585A603d272fbb1cd81ad795647c5123',
} as const satisfies ContractAddresses<ProfileSupportedChainId>
