import { ChainId } from '@pancakeswap/sdk'
import { FarmConfigV3 } from '../src/types'
import { farmsV3 as farm1 } from './1'
import { farmsV3 as farm5 } from './5'
import { farmsV3 as farm56 } from './56'
import { farmsV3 as farm97 } from './97'

// It's okay to import all farms directly, we will only use it on server side
export const farmsV3Map: Record<ChainId, FarmConfigV3[]> = {
  [ChainId.ETHEREUM]: farm1,
  [ChainId.GOERLI]: farm5,
  [ChainId.BSC]: farm56,
  [ChainId.BSC_TESTNET]: farm97,
}
