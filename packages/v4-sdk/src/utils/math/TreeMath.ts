/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import { maxUint24, maxUint256, maxUint8, toHex } from 'viem'
import type { BinTree, Bytes32 } from '../../types'

const toHex32 = (value: number | bigint) => {
  return toHex(BigInt(value) & maxUint256, { size: 32 })
}

/**
 * Returns true if the tree contains the id
 */
const contains = (tree: BinTree, id: bigint): boolean => {
  const key2 = Number(id >> 8n)
  const leaves = BigInt(tree.level2[key2] || '0')

  return (leaves & (1n << (id & maxUint8))) !== 0n
}

/**
 * Adds the id to the tree, returns true if the id was not already in the tree
 */
const add = (tree: BinTree, id: bigint): boolean => {
  const key2 = Number(id >> 8n)

  let leaves = BigInt(tree.level2[key2] || '0')
  const newLeaves = leaves | (1n << (id & maxUint8))

  if (leaves !== newLeaves) {
    tree.level2[key2] = toHex32(newLeaves)

    if (leaves === 0n) {
      const key1 = Number(id >> 16n)
      leaves = BigInt(tree.level1[key1] || '0')
      tree.level1[key1] = toHex32(leaves | (1n << (BigInt(key2) & maxUint8)))

      if (leaves === 0n) {
        tree.level0 = toHex32(BigInt(tree.level0) | (1n << (BigInt(key1) & maxUint8)))
      }
    }

    return true
  }

  return false
}

/**
 * Removes the id from the tree, returns true if the id was in the tree
 */
const remove = (tree: BinTree, id: bigint): boolean => {
  const key2 = Number(id >> 8n)

  const leaves = BigInt(tree.level2[key2] || '0')
  let newLeaves = leaves & ~(1n << (id & maxUint8))

  if (leaves !== newLeaves) {
    tree.level2[key2] = toHex32(newLeaves)

    if (newLeaves === 0n) {
      const key1 = Number(id >> 16n)
      newLeaves = BigInt(tree.level1[key1]) & ~(1n << (BigInt(key2) & maxUint8))
      tree.level1[key1] = toHex32(newLeaves)

      if (newLeaves === 0n) {
        tree.level0 = toHex32(BigInt(tree.level0) & ~(1n << (BigInt(key1) & maxUint8)))
      }
    }

    return true
  }

  return false
}

const mostSignificantBit = (value: bigint | Bytes32): bigint => {
  return BigInt(BigInt(value).toString(2).length - 1)
}

const leastSignificantBit = (value: bigint | Bytes32 = 0n): bigint => {
  value = BigInt(value)
  if (value === 0n) return 255n
  let bitPosition = 0n
  while ((value & 1n) === 0n) {
    value >>= 1n
    bitPosition++
  }

  return bitPosition
}

const closestBitLeft = (leaves: Bytes32, bit: bigint): bigint => {
  bit += 1n
  const l = BigInt(leaves) >> bit

  return l === 0n ? maxUint256 : leastSignificantBit(l) + bit
}

const closestBitRight = (leaves: Bytes32, bit: bigint): bigint => {
  const shift = 255n - (bit - 1n)
  const r = toHex32(BigInt(leaves) << shift)

  return BigInt(r) === 0n ? maxUint256 : mostSignificantBit(r) - shift
}

/**
 * Returns the first right id in the tree that is lte the given id
 */
const findFirstRight = (tree: BinTree, id: bigint): bigint => {
  let leaves

  let key2 = Number(id >> 8n)
  let bit = id & maxUint8

  if (bit !== 0n) {
    leaves = tree.level2[key2]
    const closestBit = closestBitRight(leaves, bit)

    if (closestBit !== maxUint256) {
      return (BigInt(key2) << 8n) | closestBit
    }
  }

  let key1 = Number(id >> 16n)
  bit = BigInt(key2) & maxUint8

  if (bit !== 0n) {
    leaves = tree.level1[key1]
    const closestBit = closestBitRight(leaves, bit)

    if (closestBit !== maxUint256) {
      key2 = Number((BigInt(key1) << 8n) | closestBit)
      leaves = tree.level2[key2]

      return (BigInt(key2) << 8n) | mostSignificantBit(leaves)
    }
  }

  bit = BigInt(key1) & maxUint8

  if (bit !== 0n) {
    leaves = tree.level0
    const closestBit = closestBitRight(leaves, bit)

    if (closestBit !== maxUint256) {
      key1 = Number(closestBit)
      leaves = tree.level1[key1]

      key2 = Number((BigInt(key1) << 8n) | mostSignificantBit(leaves))
      leaves = tree.level2[key2]

      return (BigInt(key2) << 8n) | mostSignificantBit(leaves)
    }
  }

  return maxUint24
}

/**
 * Returns the first left id in the tree that is gte the given id
 */
const findFirstLeft = (tree: BinTree, id: bigint): bigint => {
  let leaves

  let key2 = Number(id >> 8n)
  let bit = id & maxUint8

  if (bit !== 255n) {
    leaves = tree.level2[key2]
    const closestBit = closestBitLeft(leaves, bit)

    if (closestBit !== maxUint256) {
      return (BigInt(key2) << 8n) | closestBit
    }
  }

  let key1 = Number(id >> 16n)
  bit = BigInt(key2) & maxUint8

  if (bit !== 255n) {
    leaves = tree.level1[key1]
    const closestBit = closestBitLeft(leaves, bit)

    if (closestBit !== maxUint256) {
      key2 = Number((BigInt(key1) << 8n) | closestBit)
      leaves = tree.level2[key2]

      return (BigInt(key2) << 8n) | leastSignificantBit(leaves)
    }
  }

  bit = BigInt(key1) & maxUint8

  if (bit !== 255n) {
    leaves = tree.level0
    const closestBit = closestBitLeft(leaves, bit)

    if (closestBit !== maxUint256) {
      key1 = Number(closestBit)
      leaves = tree.level1[key1] ?? ''

      key2 = Number((BigInt(key1) << 8n) | leastSignificantBit(leaves))
      leaves = tree.level2[key2] ?? ''

      return (BigInt(key2) << 8n) | leastSignificantBit(leaves)
    }
  }

  return 0n
}
/**
 * functions to interact with the binTree
 */
export const TreeMath = {
  contains,
  add,
  remove,
  findFirstLeft,
  findFirstRight,
}
