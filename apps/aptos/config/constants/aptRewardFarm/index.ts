import { ChainId } from '@pancakeswap/aptos-swap-sdk'
import { farms as MainnetFarm } from './1'
import { farms as TestnetFarm } from './2'

export const getAptRewardFarmConfig = (chainId: number) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return MainnetFarm
    case ChainId.TESTNET:
      return TestnetFarm
    default:
      return []
  }
}
