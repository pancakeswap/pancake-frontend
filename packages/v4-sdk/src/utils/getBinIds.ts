import { convertBinIdsToRelative } from './convertBinIdsToRelative'

/**
 * Generate list of BinIds.
 *
 * @example
 * given activeId = 100, numBins = 3, returns [99, 100, 101]
 * given activeId = 100, numBins = 4, returns [98, 99, 100, 101]
 */
export const getBinIds = (activeId: bigint, numBins: bigint, relative = false): bigint[] => {
  let startId = activeId - numBins / 2n
  const binIds: bigint[] = []

  for (let index = 0; index < numBins; index++) {
    binIds.push(startId)
    startId++
  }

  return relative ? convertBinIdsToRelative(binIds, activeId) : binIds
}
