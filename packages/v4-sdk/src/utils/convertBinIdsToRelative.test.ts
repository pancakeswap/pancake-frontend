import { expect, test } from 'vitest'
import { convertBinIdsToRelative } from './convertBinIdsToRelative'

test('covertBinIdsToRelative', () => {
  expect(convertBinIdsToRelative([100n, 101n, 102n], 101n)).toStrictEqual([-1n, 0n, 1n])
})
