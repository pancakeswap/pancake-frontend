import invariant from 'tiny-invariant'
import { Address, encodeFunctionData, Hex, toHex } from 'viem'
import { BinPoolManager } from '../../../abis/BinPoolManager'
import { PoolKey } from '../../../types'
import { encodePoolKey } from '../../../utils'
import { encodeLiquidityConfig, LiquidityConfig } from '../liquidityConfigs'

export type BinPoolMintParams = {
  /**
   * nft minted to
   */
  to: Address
  liquidityConfigs: LiquidityConfig[]
  // [amountX, amountY]
  amountIn: [bigint, bigint]
  binStep: bigint
  salt: string | number
}

export const binPoolMintCalldata = <THookData extends Hex>(
  key: PoolKey,
  params: BinPoolMintParams,
  hookData: THookData
) => {
  invariant(params.liquidityConfigs.length > 0, 'LIQUIDITY_CONFIGS_EMPTY')

  const [X, Y] = params.amountIn

  return encodeFunctionData({
    abi: BinPoolManager,
    functionName: 'mint',
    args: [
      encodePoolKey(key),
      {
        ...params,
        // eslint-disable-next-line no-bitwise
        amountIn: toHex((Y << 128n) | X, { size: 32 }),
        salt: toHex(params.salt, { size: 32 }),
        liquidityConfigs: params.liquidityConfigs.map((config) => encodeLiquidityConfig(config)),
      },
      hookData,
    ],
  })
}
