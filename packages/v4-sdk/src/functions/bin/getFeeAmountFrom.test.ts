import { describe, expect, test } from 'vitest'
import { getFeeAmountFrom } from './getFeeAmountFrom'

describe('getFeeAmount', () => {
  test('random', () => {
    expect(getFeeAmountFrom(21067094038053243n, 3000n)).toBe(63201282114160n)
  })
})
