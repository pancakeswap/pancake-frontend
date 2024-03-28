import { describe, expect, it } from 'vitest'
import { getIdFromPrice } from './getIdFromPrice'

describe('getIdFromPrice', () => {
  it('works when the price is lower than 1', () => {
    expect(getIdFromPrice(0.9999, 1)).toEqual(8388607)
  })
  it('works when the price is greater than 1', () => {
    expect(getIdFromPrice(1.0001, 1)).toEqual(8388609)
  })
})
