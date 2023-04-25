import { ZERO } from '../internalConstants'

interface FeeGrowthOutside {
  feeGrowthOutside0X128: bigint
  feeGrowthOutside1X128: bigint
}

const Q256 = 2n ** 256n

export function subIn256(x: bigint, y: bigint): bigint {
  const difference = x - y

  if (difference < ZERO) {
    return Q256 + difference
  }
  return difference
}

export abstract class TickLibrary {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static getFeeGrowthInside(
    feeGrowthOutsideLower: FeeGrowthOutside,
    feeGrowthOutsideUpper: FeeGrowthOutside,
    tickLower: number,
    tickUpper: number,
    tickCurrent: number,
    feeGrowthGlobal0X128: bigint,
    feeGrowthGlobal1X128: bigint
  ) {
    let feeGrowthBelow0X128: bigint
    let feeGrowthBelow1X128: bigint
    if (tickCurrent >= tickLower) {
      feeGrowthBelow0X128 = feeGrowthOutsideLower.feeGrowthOutside0X128
      feeGrowthBelow1X128 = feeGrowthOutsideLower.feeGrowthOutside1X128
    } else {
      feeGrowthBelow0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideLower.feeGrowthOutside0X128)
      feeGrowthBelow1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideLower.feeGrowthOutside1X128)
    }

    let feeGrowthAbove0X128: bigint
    let feeGrowthAbove1X128: bigint
    if (tickCurrent < tickUpper) {
      feeGrowthAbove0X128 = feeGrowthOutsideUpper.feeGrowthOutside0X128
      feeGrowthAbove1X128 = feeGrowthOutsideUpper.feeGrowthOutside1X128
    } else {
      feeGrowthAbove0X128 = subIn256(feeGrowthGlobal0X128, feeGrowthOutsideUpper.feeGrowthOutside0X128)
      feeGrowthAbove1X128 = subIn256(feeGrowthGlobal1X128, feeGrowthOutsideUpper.feeGrowthOutside1X128)
    }

    return [
      subIn256(subIn256(feeGrowthGlobal0X128, feeGrowthBelow0X128), feeGrowthAbove0X128),
      subIn256(subIn256(feeGrowthGlobal1X128, feeGrowthBelow1X128), feeGrowthAbove1X128),
    ]
  }
}
