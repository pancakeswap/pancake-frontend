import { ChainId } from '@pancakeswap/sdk'

import { PoolsSupportedChainId } from './pools'

export type ContractAddresses<T extends ChainId> = {
  [chainId in T]: string
}

export const ICAKE = {
  [ChainId.BSC]: '0x3C458828D1622F5f4d526eb0d24Da8C4Eb8F07b1',
} satisfies ContractAddresses<PoolsSupportedChainId>
