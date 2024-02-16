import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem'
import { SupportedChainId } from './constants/supportedChains'
import { ContractAddresses } from './type'

export const galetoOracleETH: Record<string, Address> = {
  [ChainId.BSC]: '0x',
  [ChainId.ZKSYNC]: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  // [ChainId.ARBITRUM_ONE]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>
