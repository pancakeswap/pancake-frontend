import { Hex, encodeFunctionData } from 'viem'
import { BinPoolManager } from '../../../abis/BinPoolManager'
import { PoolKey } from '../../../types'
import { encodePoolKey } from '../../../utils/encodePoolKey'

export const binPoolSwapCalldata = (
  poolKey: PoolKey<'Bin'>,
  swapForY: boolean,
  amountIn: bigint,
  hookData: Hex = '0x'
) => {
  return encodeFunctionData({
    abi: BinPoolManager,
    functionName: 'swap',
    args: [encodePoolKey(poolKey), swapForY, amountIn, hookData],
  })
}
