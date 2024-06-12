import { Hex, encodeFunctionData } from 'viem'
import { BinPoolManager } from '../../../abis/BinPoolManager'
import { PoolKey, parsePoolKey } from '../../../utils/poolKey'

export const binPoolSwapCalldata = (
  poolKey: PoolKey<'Bin'>,
  swapForY: boolean,
  amountIn: bigint,
  hookData: Hex = '0x'
) => {
  return encodeFunctionData({
    abi: BinPoolManager,
    functionName: 'swap',
    args: [parsePoolKey(poolKey), swapForY, amountIn, hookData],
  })
}
