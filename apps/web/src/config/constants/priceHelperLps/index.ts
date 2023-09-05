import { getFarmsPriceHelperLpFiles } from '@pancakeswap/farms/constants/priceHelperLps/getFarmsPriceHelperLpFiles'
import { ChainId } from '@pancakeswap/sdk'
import PoolsEthereumPriceHelper from './pools/1'
import PoolsGoerliPriceHelper from './pools/5'
import PoolsBscPriceHelper from './pools/56'
import PoolsBscTestnetPriceHelper from './pools/97'
import PoolsArbPriceHelper from './pools/42161'
import PoolsArbTestnetPriceHelper from './pools/421613'
import PoolsZkSyncPriceHelper from './pools/324'
import PoolsZkSyncTestnetPriceHelper from './pools/280'

export { getFarmsPriceHelperLpFiles }

export const getPoolsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return PoolsBscPriceHelper
    case ChainId.BSC_TESTNET:
      return PoolsBscTestnetPriceHelper
    case ChainId.ETHEREUM:
      return PoolsEthereumPriceHelper
    case ChainId.GOERLI:
      return PoolsGoerliPriceHelper
    case ChainId.ARBITRUM_ONE:
      return PoolsArbPriceHelper
    case ChainId.ARBITRUM_GOERLI:
      return PoolsArbTestnetPriceHelper
    case ChainId.ZKSYNC:
      return PoolsZkSyncPriceHelper
    case ChainId.ZKSYNC_TESTNET:
      return PoolsZkSyncTestnetPriceHelper
    default:
      return []
  }
}
