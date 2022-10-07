export enum ByteComparison {
  SMALLER,
  GREATER,
  EQUAL,
}

// Clone from
// https://github.com/aptos-labs/aptos-core/blob/main/aptos-move/framework/aptos-stdlib/sources/comparator.move#L35
export default function compareByte(left: Uint8Array, right: Uint8Array): ByteComparison {
  const leftLength = left.length
  const rightLength = right.length

  let idx = 0

  while (idx < leftLength && idx < rightLength) {
    const leftByte = left[idx]
    const rightByte = right[idx]

    if (leftByte < rightByte) {
      return ByteComparison.SMALLER
    }

    if (leftByte > rightByte) {
      return ByteComparison.GREATER
    }

    idx += 1
  }

  if (leftLength < rightLength) {
    return ByteComparison.SMALLER
  }
  if (leftLength > rightLength) {
    return ByteComparison.GREATER
  }
  return ByteComparison.EQUAL
}
