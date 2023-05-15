import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'wagmi'

export const WBETH: Record<number, Address> = {
  [ChainId.ETHEREUM]: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
  [ChainId.BSC]: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
  [ChainId.BSC_TESTNET]: '0x34f8f72e3f14Ede08bbdA1A19a90B35a80f3E789',
  [ChainId.GOERLI]: '0xE7bCB9e341D546b66a46298f4893f5650a56e99E',
}
