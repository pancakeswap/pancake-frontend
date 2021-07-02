import { BigNumber } from 'ethers'
import { formatBigNumber } from 'utils/formatBalance'

describe('formatBigNumber', () => {
  it.each([
    ['13853728395577367836', 4, 18, '13.8537'],
    ['2652487215692514844', 2, 18, '2.65'],
    ['1120124117988485', 3, 18, '0.001'],
    ['1120124117988485', 1, 18, '0.0'],
    ['207655447689', 2, 9, '207.65'],
    ['6652397734197674016', 8, 18, '6.65239773'],
    ['23810432295393761', 18, 18, '0.023810432295393761'],
    ['23810432295393761', 9, 18, '0.023810432'],
    ['23810432295393761', 1, 18, '0.0'],
    ['1000000000000000000', 1, 18, '1.0'],
    ['0', 1, 18, '0.0'],
    ['0', 2, 18, '0.0'],
  ])('correctly formats %s (%d, %d) correctly to %s', (value, displayDecimals, decimals, expected) => {
    const ethersBn = BigNumber.from(value)
    expect(formatBigNumber(ethersBn, displayDecimals, decimals)).toBe(expected)
  })
})
