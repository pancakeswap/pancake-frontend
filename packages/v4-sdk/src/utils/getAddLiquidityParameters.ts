import { Address } from 'viem'
import { Bytes32 } from '../types'
import { convertBinIdsToRelative } from './convertBinIdsToRelative'

export type AddBinLiquidityParams = {
  /**
   * @see {@link PoolKey}
   */
  poolKey: Bytes32
  /**
   * Amount to send for token0
   */
  amount0: bigint
  /**
   * Amount to send for token1
   */
  amount1: bigint
  /**
   * Min amount to send for token0
   */
  amount0Min: bigint
  /**
   * Min amount to send for token1
   */
  amount1Min: bigint
  /**
   * Active id that user wants to add liquidity from
   */
  activeIdDesired: bigint
  /**
   * Number of id that are allowed to slip
   */
  isSlippage: bigint
  /**
   * List of delta ids to add liquidity (`deltaId = activeId - desiredId`)
   */
  deltaIds: bigint[]
  /**
   * Distribution of tokenX with sum(distributionX) = 100e18 (100%) or 0 (0%)
   */
  distributionX: bigint[]
  /**
   * Distribution of tokenY with sum(distributionY) = 100e18 (100%) or 0 (0%)
   */
  distributionY: bigint[]
  /**
   * Address of recipient
   */
  to: Address
  /**
   * Deadline of transaction
   */
  deadline: bigint
}

export type GetAddBinParams = {
  poolKey: Bytes32
  binIds: bigint[]
  amount0: bigint
  amount0Min?: bigint
  amount1: bigint
  amount1Min: bigint
  activeId: bigint
  isSlippage?: bigint
  recipient: Address
  deadline: bigint
}

// @w.i.p @ChefJerry
export const getAddBinParams = ({
  poolKey,
  binIds,
  amount0,
  amount0Min = 0n,
  amount1,
  amount1Min = 0n,
  activeId,
  isSlippage = 0n,
  recipient,
  deadline,
}: GetAddBinParams): AddBinLiquidityParams => {
  // num of bins to the left and right
  const { numBinY, numBinX } = binIds.reduce<{ numBinX: bigint; numBinY: bigint }>(
    (acc, id) => {
      if (id <= activeId) acc.numBinY += 1n
      if (id >= activeId) acc.numBinX += 1n
      return acc
    },
    {
      numBinY: 0n,
      numBinX: 0n,
    }
  )

  const { distributionX, distributionY } = binIds.reduce<{
    distributionX: bigint[]
    distributionY: bigint[]
  }>(
    (acc, id) => {
      acc.distributionX.push(id >= activeId && numBinX > 0 ? BigInt(1e18) / numBinX : 0n)
      acc.distributionY.push(id <= activeId && numBinY > 0 ? BigInt(1e18) / numBinY : 0n)
      return acc
    },
    {
      distributionX: [],
      distributionY: [],
    }
  )

  const params: AddBinLiquidityParams = {
    poolKey,
    amount0,
    amount1,
    amount0Min,
    amount1Min,
    isSlippage,
    activeIdDesired: activeId,
    deltaIds: convertBinIdsToRelative(binIds, activeId),
    distributionX,
    distributionY,
    to: recipient,
    deadline,
  }

  return params
}
