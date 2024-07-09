import { expect, test } from 'vitest'
import { getBinIds } from './getBinIds'

test('get bin ids', () => {
  expect(getBinIds(100n, 3n)).toStrictEqual([99n, 100n, 101n])
  expect(getBinIds(100n, 4n)).toStrictEqual([98n, 99n, 100n, 101n])
})
