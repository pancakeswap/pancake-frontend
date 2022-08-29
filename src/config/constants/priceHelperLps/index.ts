import { ChainId } from '@pancakeswap/sdk'
import BscPriceHelper from './56'
import BscTestnetPriceHelper from './97'
import EthereumPriceHelper from './1'
import GoerliPriceHelper from './5'

export const getPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return BscPriceHelper
    case ChainId.BSC_TESTNET:
      return BscTestnetPriceHelper
    case ChainId.ETHEREUM:
      return EthereumPriceHelper
    case ChainId.GOERLI:
      return GoerliPriceHelper
    default:
      return []
  }
}
