import { describe, expect, it } from 'vitest'
import { Fraction } from '../src'

describe('Fraction', () => {
  describe('#quotient', () => {
    it('floor division', () => {
      expect(new Fraction(8n, 3n).quotient).toEqual(2n) // one below
      expect(new Fraction(12n, 4n).quotient).toEqual(3n) // exact
      expect(new Fraction(16n, 5n).quotient).toEqual(3n) // one above
    })
  })
  describe('#remainder', () => {
    it('returns fraction after divison', () => {
      expect(new Fraction(8n, 3n).remainder).toEqual(new Fraction(2n, 3n))
      expect(new Fraction(12n, 4n).remainder).toEqual(new Fraction(0n, 4n))
      expect(new Fraction(16n, 5n).remainder).toEqual(new Fraction(1n, 5n))
    })
  })
  describe('#invert', () => {
    it('flips num and denom', () => {
      expect(new Fraction(5n, 10n).invert().numerator).toEqual(10n)
      expect(new Fraction(5n, 10n).invert().denominator).toEqual(5n)
    })
  })
  describe('#add', () => {
    it('multiples denoms and adds nums', () => {
      expect(new Fraction(1n, 10n).add(new Fraction(4n, 12n))).toEqual(new Fraction(52n, 120n))
    })

    it('same denom', () => {
      expect(new Fraction(1n, 5n).add(new Fraction(2n, 5n))).toEqual(new Fraction(3n, 5n))
    })
  })
  describe('#subtract', () => {
    it('multiples denoms and subtracts nums', () => {
      expect(new Fraction(1n, 10n).subtract(new Fraction(4n, 12n))).toEqual(new Fraction(BigInt(-28), 120n))
    })
    it('same denom', () => {
      expect(new Fraction(3n, 5n).subtract(new Fraction(2n, 5n))).toEqual(new Fraction(1n, 5n))
    })
  })
  describe('#lessThan', () => {
    it('correct', () => {
      expect(new Fraction(1n, 10n).lessThan(new Fraction(4n, 12n))).toBe(true)
      expect(new Fraction(1n, 3n).lessThan(new Fraction(4n, 12n))).toBe(false)
      expect(new Fraction(5n, 12n).lessThan(new Fraction(4n, 12n))).toBe(false)
    })
  })
  describe('#equalTo', () => {
    it('correct', () => {
      expect(new Fraction(1n, 10n).equalTo(new Fraction(4n, 12n))).toBe(false)
      expect(new Fraction(1n, 3n).equalTo(new Fraction(4n, 12n))).toBe(true)
      expect(new Fraction(5n, 12n).equalTo(new Fraction(4n, 12n))).toBe(false)
    })
  })
  describe('#greaterThan', () => {
    it('correct', () => {
      expect(new Fraction(1n, 10n).greaterThan(new Fraction(4n, 12n))).toBe(false)
      expect(new Fraction(1n, 3n).greaterThan(new Fraction(4n, 12n))).toBe(false)
      expect(new Fraction(5n, 12n).greaterThan(new Fraction(4n, 12n))).toBe(true)
    })
  })
  describe('#multiplty', () => {
    it('correct', () => {
      expect(new Fraction(1n, 10n).multiply(new Fraction(4n, 12n))).toEqual(new Fraction(4n, 120n))
      expect(new Fraction(1n, 3n).multiply(new Fraction(4n, 12n))).toEqual(new Fraction(4n, 36n))
      expect(new Fraction(5n, 12n).multiply(new Fraction(4n, 12n))).toEqual(new Fraction(20n, 144n))
    })
  })
  describe('#divide', () => {
    it('correct', () => {
      expect(new Fraction(1n, 10n).divide(new Fraction(4n, 12n))).toEqual(new Fraction(12n, 40n))
      expect(new Fraction(1n, 3n).divide(new Fraction(4n, 12n))).toEqual(new Fraction(12n, 12n))
      expect(new Fraction(5n, 12n).divide(new Fraction(4n, 12n))).toEqual(new Fraction(60n, 48n))
    })
  })
  describe('#asFraction', () => {
    it('returns an equivalent but not the same reference fraction', () => {
      const f = new Fraction(1, 2)
      expect(f.asFraction).toEqual(f)
      expect(f === f.asFraction).toEqual(false)
    })
  })
})
