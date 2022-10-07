import { BCS } from 'aptos'
import compareByte, { ByteComparison } from './compareByte'

describe('compareBytes', () => {
  it('test strings', () => {
    const value0 = BCS.bcsSerializeStr('alpha')
    const value1 = BCS.bcsSerializeStr('beta')
    const value2 = BCS.bcsSerializeStr('betaa')

    expect(compareByte(value0, value0)).toBe(ByteComparison.EQUAL)
    expect(compareByte(value1, value1)).toBe(ByteComparison.EQUAL)
    expect(compareByte(value2, value2)).toBe(ByteComparison.EQUAL)

    expect(compareByte(value0, value1)).toBe(ByteComparison.GREATER)
    expect(compareByte(value1, value0)).toBe(ByteComparison.SMALLER)

    expect(compareByte(value0, value2)).toBe(ByteComparison.SMALLER)
    expect(compareByte(value2, value0)).toBe(ByteComparison.GREATER)

    expect(compareByte(value1, value2)).toBe(ByteComparison.SMALLER)
    expect(compareByte(value2, value1)).toBe(ByteComparison.GREATER)
  })

  it('test 128', () => {
    const value0 = BCS.bcsSerializeU128(5)
    const value1 = BCS.bcsSerializeU128(152)
    const value2 = BCS.bcsSerializeU128(511) // 0x1ff

    expect(compareByte(value0, value0)).toBe(ByteComparison.EQUAL)
    expect(compareByte(value1, value1)).toBe(ByteComparison.EQUAL)
    expect(compareByte(value2, value2)).toBe(ByteComparison.EQUAL)

    expect(compareByte(value0, value1)).toBe(ByteComparison.SMALLER)
    expect(compareByte(value1, value0)).toBe(ByteComparison.GREATER)

    expect(compareByte(value0, value2)).toBe(ByteComparison.SMALLER)
    expect(compareByte(value2, value0)).toBe(ByteComparison.GREATER)

    expect(compareByte(value1, value2)).toBe(ByteComparison.SMALLER)
    expect(compareByte(value2, value1)).toBe(ByteComparison.GREATER)
  })
})
