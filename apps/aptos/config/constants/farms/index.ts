import { ChainId } from '@pancakeswap/aptos-swap-sdk'
import MainnetFarm from './1'
import TestnetFarm from './2'

export const getFarmConfig = (chainId: number) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return MainnetFarm
    case ChainId.TESTNET:
      return TestnetFarm
    default:
      return []
  }
}
