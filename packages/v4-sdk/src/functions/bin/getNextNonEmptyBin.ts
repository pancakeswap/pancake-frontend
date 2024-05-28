import invariant from 'tiny-invariant'
import { TreeMath } from '../../utils/math/TreeMath'
import { BinPoolState } from './createBinPool'

/**
 * Returns the next non-empty bin
 *
 * the next non-empty bin is the bin that is closest to the activeId.
 * if swapForY is true, it will return the next bin to the right (higher),
 * otherwise it will return the next bin to the left (lower)
 *
 * @param binPool
 * @param activeId
 * @param swapForY
 * @returns next non-empty bin
 */
export const getNextNonEmptyBin = (binPool: BinPoolState, activeId: bigint, swapForY: boolean): bigint => {
  invariant(binPool.tree, 'EMPTY_BIN_POOL')

  return swapForY
    ? TreeMath.findFirstRight(binPool.tree, BigInt(activeId))
    : TreeMath.findFirstLeft(binPool.tree, BigInt(activeId))
}
