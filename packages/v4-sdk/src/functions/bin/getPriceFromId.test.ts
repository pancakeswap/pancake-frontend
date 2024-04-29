import { describe, expect, it } from 'vitest'
import { getPriceFromId } from './getPriceFromId'

describe('getPriceFromId', () => {
  it('exp = 0', () => {
    expect(getPriceFromId(8388608n, 10n)).toBe(340282366920938463463374607431768211456n)
  })
  it('exp < 0', () => {
    expect(getPriceFromId(8375542n, 10n)).toBe(724741449435749248767161795233422n)
  })
  it('exp > 0x100000', () => {
    expect(() => getPriceFromId(0n, 10n)).toThrow('Invariant failed: EXPONENT')
  })
  it('binStep = 0', () => {
    expect(getPriceFromId(8388608n, 0n)).toBe(340282366920938463463374607431768211456n)
    expect(getPriceFromId(8375541n, 0n)).toBe(340282366920938463463374607431768198389n)
  })
})
