/* eslint-disable no-bitwise */

import { Hex, toHex } from 'viem'

export type LiquidityConfig = {
  /**
   * The distribution of the first token
   */
  distributionX: bigint
  /**
   * The distribution of the second token
   */
  distributionY: bigint
  id: bigint
}

export const encodeLiquidityConfig = ({ distributionX, distributionY, id }: LiquidityConfig) => {
  return toHex((BigInt.asUintN(64, distributionX) << 88n) | (BigInt.asUintN(64, distributionY) << 24n) | id, {
    size: 32,
  })
}

export const decodeLiquidityConfig = (config: Hex): LiquidityConfig => {
  const distributionX = BigInt.asUintN(64, BigInt(config) >> 88n)
  const distributionY = BigInt.asUintN(64, BigInt(config) >> 24n)
  const id = BigInt.asUintN(24, BigInt(config))

  return { distributionX, distributionY, id }
}
