import { ChainId } from '@pancakeswap/aptos-swap-sdk'
import FarmsMainnetPriceHelper from './farms/1'
import FarmsTestnetPriceHelper from './farms/2'
import PoolsMainnetPriceHelper from './pools/1'
import PoolsTestnetPriceHelper from './pools/2'

export const getFarmsPriceHelperLpFiles = (chainId: number) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return FarmsMainnetPriceHelper
    case ChainId.TESTNET:
      return FarmsTestnetPriceHelper
    default:
      return []
  }
}

export const getPoolsPriceHelperLpFiles = (chainId: number) => {
  switch (chainId) {
    case ChainId.MAINNET:
      return PoolsMainnetPriceHelper
    case ChainId.TESTNET:
      return PoolsTestnetPriceHelper
    default:
      return []
  }
}
