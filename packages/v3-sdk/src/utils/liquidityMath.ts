import { NEGATIVE_ONE, ZERO } from '../internalConstants'

export abstract class LiquidityMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static addDelta(x: bigint, y: bigint): bigint {
    if (y < ZERO) {
      return x - y * NEGATIVE_ONE
    }
    return x + y
  }
}
