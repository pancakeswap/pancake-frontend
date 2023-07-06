import { ChainId } from '@pancakeswap/sdk'
import { ComputedFarmConfigV3 } from '../../src/types'
import { FarmSupportedChainId } from '../../src'
import { farmsV3 as farm1 } from '../1'
import { farmsV3 as farm5 } from '../5'
import { farmsV3 as farm56 } from '../56'
import { farmsV3 as farm97 } from '../97'
import { farmsV3 as farm280 } from '../280'

export const farmsV3ConfigChainMap: Record<FarmSupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: farm1,
  [ChainId.GOERLI]: farm5,
  [ChainId.BSC]: farm56,
  [ChainId.BSC_TESTNET]: farm97,
  [ChainId.ZKSYNC_TESTNET]: farm280,
}
