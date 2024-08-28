import { zkSyncTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xfd7162698660Ba63933DDA5140CCFDcE6b98A0E3',
    token0: zkSyncTestnetTokens.weth,
    token1: zkSyncTestnetTokens.mock,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 2,
    lpAddress: '0x6901Ec1Fc111685052290cf54Db38CFe0Baf068d',
    token0: zkSyncTestnetTokens.weth,
    token1: zkSyncTestnetTokens.mockC,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 3,
    lpAddress: '0xa6C513d58530eC9a3bc074DD2DbC66e6065Fe85C',
    token0: zkSyncTestnetTokens.mockD,
    token1: zkSyncTestnetTokens.mockC,
    feeAmount: FeeAmount.HIGH,
  },
])
