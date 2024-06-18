import { encodeFunctionData, Hex } from 'viem'
import { CLPoolManager } from '../../../abis/CLPoolManager'
import { PoolKey } from '../../../types'
import { encodePoolKey } from '../../../utils'

export type CLPoolSwapParams = {
  zeroForOne: boolean
  amountSpecified: bigint
  sqrtPriceLimitX96: bigint
}

export const clPoolSwapCalldata = (poolKey: PoolKey<'CL'>, swapParams: CLPoolSwapParams, hookData: Hex = '0x') => {
  return encodeFunctionData({
    abi: CLPoolManager,
    functionName: 'swap',
    args: [encodePoolKey(poolKey), swapParams, hookData],
  })
}
