import { ChainId } from '@pancakeswap/sdk'
import BscPriceHelper from './56'
import BscTestnetPriceHelper from './97'

export const getPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return BscPriceHelper
    case ChainId.BSC_TESTNET:
      return BscTestnetPriceHelper
    default:
      return []
  }
}
