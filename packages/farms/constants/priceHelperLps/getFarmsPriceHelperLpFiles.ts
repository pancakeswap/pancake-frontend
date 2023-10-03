import { ChainId } from '@pancakeswap/chains'
import FarmsBscPriceHelper from './56'
import FarmsBscTestnetPriceHelper from './97'
import FarmsEthereumPriceHelper from './1'
import FarmsGoerliPriceHelper from './5'
import FarmsArbitrumHelper from './42161'
import FarmsLineaHelper from './59144'
import FarmsBaseHelper from './8453'

export const getFarmsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return FarmsBscPriceHelper
    case ChainId.BSC_TESTNET:
      return FarmsBscTestnetPriceHelper
    case ChainId.ETHEREUM:
      return FarmsEthereumPriceHelper
    case ChainId.GOERLI:
      return FarmsGoerliPriceHelper
    case ChainId.ARBITRUM_ONE:
      return FarmsArbitrumHelper
    case ChainId.LINEA:
      return FarmsLineaHelper
    case ChainId.BASE:
      return FarmsBaseHelper
    default:
      return []
  }
}
