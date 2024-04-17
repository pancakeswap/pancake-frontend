import invariant from 'tiny-invariant'
import { TreeMath } from '../../utils/math/TreeMath'
import { BinPoolState } from './getBinPool'

export const getNextNonEmptyBin = (binPool: BinPoolState, activeId: bigint, zeroForOne: boolean): bigint => {
  invariant(binPool.tree, 'EMPTY_BIN_POOL')

  return zeroForOne
    ? TreeMath.findFirstRight(binPool.tree, BigInt(activeId))
    : TreeMath.findFirstLeft(binPool.tree, BigInt(activeId))
}
