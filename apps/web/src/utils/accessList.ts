/**
 * @file This file is intended to be used in a browser environment only.
 * It can be moved to @pancakeswap/utils for future reuse if necessary
 * Ideally will use merkle tree for better performance in the future
 */

export type Serializable =
  | string
  | {
      toString: () => string
    }

export type AccessList = {
  isInList: (item: Serializable) => Promise<boolean>
}

async function createHashHex(item: Serializable) {
  const encoder = new TextEncoder()
  const serialized = typeof item === 'string' ? item : item.toString()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(serialized))

  // Convert the ArrayBuffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createAccessList(list: Serializable[]): Promise<AccessList> {
  const set = new Set<string>()
  const hashes = await Promise.all(list.map(createHashHex))
  for (const hash of hashes) {
    set.add(hash)
  }

  return {
    isInList: async (item) => {
      const hash = await createHashHex(item)
      return set.has(hash)
    },
  }
}
