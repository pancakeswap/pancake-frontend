import { subIn256 } from '.'
import { Q128 } from '../internalConstants'

export abstract class PositionLibrary {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  // replicates the portions of Position#update required to compute unaccounted fees
  public static getTokensOwed(
    feeGrowthInside0LastX128: bigint,
    feeGrowthInside1LastX128: bigint,
    liquidity: bigint,
    feeGrowthInside0X128: bigint,
    feeGrowthInside1X128: bigint
  ) {
    const tokensOwed0 = (subIn256(feeGrowthInside0X128, feeGrowthInside0LastX128) * liquidity) / Q128

    const tokensOwed1 = (subIn256(feeGrowthInside1X128, feeGrowthInside1LastX128) * liquidity) / Q128

    return [tokensOwed0, tokensOwed1]
  }
}
