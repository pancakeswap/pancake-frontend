import { ChainId } from '@pancakeswap/sdk'
import BscFarmConfig from './56'
import BscTestnetFarmConfig from './97'

export const getFarmConfig = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return BscFarmConfig
    case ChainId.BSC_TESTNET:
      return BscTestnetFarmConfig
    default:
      return []
  }
}
