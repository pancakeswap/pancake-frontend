import { maxUint24, toHex } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { BinTree } from '../../types'
import { TreeMath } from './TreeMath'

describe('TreeMath', () => {
  let tree: BinTree

  const initialTree = Object.freeze({
    level0: toHex(0, { size: 32 }),
    level1: {},
    level2: {},
  })
  const resetTree = () => {
    tree = {
      level0: initialTree.level0,
      level1: {},
      level2: {},
    }
  }

  beforeEach(resetTree)

  describe('#add', () => {
    it('should add multiple times', () => {
      TreeMath.add(tree, 0n)
      TreeMath.add(tree, 1n)
      TreeMath.add(tree, 256n)
      expect(tree).toMatchInlineSnapshot(`
{
  "level0": "0x0000000000000000000000000000000000000000000000000000000000000001",
  "level1": {
    "0": "0x0000000000000000000000000000000000000000000000000000000000000003",
  },
  "level2": {
    "0": "0x0000000000000000000000000000000000000000000000000000000000000003",
    "1": "0x0000000000000000000000000000000000000000000000000000000000000001",
  },
}
`)
    })
    it('should matched', () => {
      TreeMath.add(tree, 256n)
      expect(tree).toMatchInlineSnapshot(`
{
  "level0": "0x0000000000000000000000000000000000000000000000000000000000000001",
  "level1": {
    "0": "0x0000000000000000000000000000000000000000000000000000000000000002",
  },
  "level2": {
    "1": "0x0000000000000000000000000000000000000000000000000000000000000001",
  },
}
`)
    })
  })
  describe('#remove', () => {
    it('should remove exist one', () => {
      TreeMath.add(tree, 256n)
      TreeMath.remove(tree, 256n)
      expect(tree).toMatchInlineSnapshot(`
{
  "level0": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "level1": {
    "0": "0x0000000000000000000000000000000000000000000000000000000000000000",
  },
  "level2": {
    "1": "0x0000000000000000000000000000000000000000000000000000000000000000",
  },
}
      `)
    })
    it('should remove non-exist one', () => {
      TreeMath.remove(tree, 256n)
      expect(tree).toEqual(initialTree)
    })
    it('should remove correct one', () => {
      TreeMath.add(tree, 256n)
      TreeMath.add(tree, 257n)
      TreeMath.remove(tree, 256n)
      const tree2 = {
        ...initialTree,
      }
      TreeMath.add(tree2, 257n)
      expect(tree).toEqual(tree2)
    })
  })
  describe('add and remove', () => {
    it('should add and remove', () => {
      TreeMath.add(tree, 0n)
      expect(TreeMath.contains(tree, 0n)).toBe(true)
      TreeMath.add(tree, 1n)
      expect(TreeMath.contains(tree, 1n)).toBe(true)
      TreeMath.add(tree, 2n)
      expect(TreeMath.contains(tree, 2n)).toBe(true)
      TreeMath.remove(tree, 1n)
      expect(TreeMath.contains(tree, 1n)).toBe(false)
    })
  })
  describe('#findFirst', () => {
    it('should find first', () => {
      TreeMath.add(tree, 0n)
      TreeMath.add(tree, 1n)
      TreeMath.add(tree, 2n)
      expect(TreeMath.findFirstRight(tree, 2n)).toBe(1n)
      expect(TreeMath.findFirstRight(tree, 1n)).toBe(0n)
      expect(TreeMath.findFirstLeft(tree, 0n)).toBe(1n)
      expect(TreeMath.findFirstLeft(tree, 1n)).toBe(2n)

      expect(TreeMath.findFirstRight(tree, 0n)).toBe(maxUint24)
      expect(TreeMath.findFirstLeft(tree, 2n)).toBe(0n)
    })
    it('should find first far', () => {
      TreeMath.add(tree, 0n)
      TreeMath.add(tree, maxUint24)

      expect(TreeMath.findFirstRight(tree, maxUint24)).toBe(0n)
      expect(TreeMath.findFirstLeft(tree, 0n)).toBe(maxUint24)
    })

    it('remove and search right', () => {
      const id = 4194304n

      TreeMath.add(tree, id)
      TreeMath.add(tree, id - 1n)

      TreeMath.contains(tree, id)
      TreeMath.contains(tree, id - 1n)

      expect(TreeMath.findFirstRight(tree, id)).toEqual(id - 1n)

      TreeMath.remove(tree, id - 1n)
      expect(TreeMath.findFirstRight(tree, id)).toEqual(maxUint24)
    })

    it('remove and search left', () => {
      const id = 4194304n

      TreeMath.add(tree, id)
      TreeMath.add(tree, id + 1n)

      TreeMath.contains(tree, id)
      TreeMath.contains(tree, id + 1n)

      expect(TreeMath.findFirstLeft(tree, id)).toEqual(id + 1n)

      TreeMath.remove(tree, id + 1n)
      expect(TreeMath.findFirstLeft(tree, id)).toEqual(0n)
    })
  })
})
