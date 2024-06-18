/**
 * covert from absolute BinIds to activeId relative ids
 *
 * @example
 * given absolute BinIdS: [100, 101, 102], activeId: 101,
 * returns relative ids [-1, 0, 1]
 *
 * @param absoluteIds
 * @param activeId
 */
export const convertBinIdsToRelative = (absoluteIds: bigint[], activeId: bigint): bigint[] => {
  return absoluteIds.map((id) => id - activeId)
}
