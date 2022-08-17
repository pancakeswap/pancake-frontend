import { ChainId } from '@pancakeswap/sdk'
import BscFarmConfig from './56'
import BscTestnetFarmConfig from './97'
import EthereumFarmConfig from './1'
import GoerliFarmConfig from './5'

export const getFarmConfig = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return BscFarmConfig
    case ChainId.BSC_TESTNET:
      return BscTestnetFarmConfig
    case ChainId.ETHEREUM:
      return EthereumFarmConfig
    case ChainId.GOERLI:
      return GoerliFarmConfig
    default:
      return []
  }
}
