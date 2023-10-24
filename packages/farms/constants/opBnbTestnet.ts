import { opBnbTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0x5EFf51E8718F7b36D09CBc0506f653E886eBdAdb',
    token0: opBnbTestnetTokens.mockA,
    token1: opBnbTestnetTokens.wbnb,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0x71C5C28442353877f6a4A196f95Ee4CfB0Dcb5Aa',
    token0: opBnbTestnetTokens.mockB,
    token1: opBnbTestnetTokens.wbnb,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 3,
    lpAddress: '0x6Cd45Ef02989A9188A9d8B170b86FAAA6d2B194C',
    token0: opBnbTestnetTokens.mockB,
    token1: opBnbTestnetTokens.mockC,
    feeAmount: FeeAmount.HIGH,
  },
])
