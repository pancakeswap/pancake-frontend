import { getFarmsPriceHelperLpFiles } from '@pancakeswap/farms/constants/priceHelperLps/getFarmsPriceHelperLpFiles'
import { ChainId } from '@pancakeswap/chains'
import PoolsEthereumPriceHelper from './pools/1'
import PoolsGoerliPriceHelper from './pools/5'
import PoolsBscPriceHelper from './pools/56'
import PoolsBscTestnetPriceHelper from './pools/97'
import PoolsArbPriceHelper from './pools/42161'
import PoolsArbTestnetPriceHelper from './pools/421613'
import PoolsZkSyncPriceHelper from './pools/324'
import PoolsZkSyncTestnetPriceHelper from './pools/280'
import PoolsBasePriceHelper from './pools/8453'
import PoolsBaseTestnetPriceHelper from './pools/84531'
import PoolsLineaPriceHelper from './pools/59144'
import PoolsLineaTestnetPriceHelper from './pools/59140'
import PoolsPolygonZkEvmPriceHelper from './pools/1101'
import PoolsPolygonZkEvmTestnetPriceHelper from './pools/1442'

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
    case ChainId.BASE:
      return PoolsBasePriceHelper
    case ChainId.BASE_TESTNET:
      return PoolsBaseTestnetPriceHelper
    case ChainId.LINEA:
      return PoolsLineaPriceHelper
    case ChainId.LINEA_TESTNET:
      return PoolsLineaTestnetPriceHelper
    case ChainId.POLYGON_ZKEVM:
      return PoolsPolygonZkEvmPriceHelper
    case ChainId.POLYGON_ZKEVM_TESTNET:
      return PoolsPolygonZkEvmTestnetPriceHelper
    default:
      return []
  }
}
