import { formatAmount, getFirstThreeNonZeroDecimals } from 'utils/formatInfoNumbers'

describe('info/utils/formatInfoNumbers', () => {
  it.each`
    value         | expected
    ${0.12345}    | ${'0.12'}
    ${0.02345}    | ${'0.023'}
    ${0.002045}   | ${'0.0020'}
    ${0.0002405}  | ${'0.00024'}
    ${0.00020005} | ${'0.00020'}
    ${0.0002}     | ${'0.00020'}
  `('getFirstThreeNonZeroDecimals returns $expected for $value', ({ value, expected }) => {
    const actual = getFirstThreeNonZeroDecimals(value)
    expect(actual).toBe(expected)
  })

  it.each`
    amount         | notation      | displayThreshold | tokenPrecision | isInteger | expected
    ${0}           | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'0.00'}
    ${NaN}         | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'-'}
    ${null}        | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'-'}
    ${0.1}         | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'0.10'}
    ${0.12}        | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'0.12'}
    ${0.123}       | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'0.12'}
    ${0.00129}     | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'0.0012'}
    ${0.00000001}  | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'0.000000010'}
    ${0.000000015} | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'0.000000015'}
    ${1}           | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'1.00'}
    ${1}           | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'1.00'}
    ${1420.22}     | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'1.42K'}
    ${1420.22}     | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'1,420.22'}
    ${69420.23}    | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'69.42K'}
    ${69420.23}    | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'69,420.23'}
    ${169420}      | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'169.42K'}
    ${2169420.22}  | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'2.17M'}
    ${2169420.22}  | ${'standard'} | ${false}         | ${false}       | ${false}  | ${'2,169,420.22'}
    ${0.000000001} | ${'compact'}  | ${false}         | ${false}       | ${false}  | ${'0.000000001'}
    ${0.000000001} | ${'compact'}  | ${0.001}         | ${false}       | ${false}  | ${'<0.001'}
    ${0.009}       | ${'compact'}  | ${0.01}          | ${false}       | ${false}  | ${'<0.01'}
    ${0.555}       | ${'compact'}  | ${false}         | ${true}        | ${false}  | ${'0.555'}
    ${1.555}       | ${'compact'}  | ${false}         | ${true}        | ${false}  | ${'1.55'}
    ${0}           | ${'compact'}  | ${false}         | ${false}       | ${true}   | ${'0'}
    ${84}          | ${'compact'}  | ${false}         | ${false}       | ${true}   | ${'84'}
    ${1000}        | ${'compact'}  | ${false}         | ${false}       | ${true}   | ${'1.00K'}
    ${1234}        | ${'compact'}  | ${false}         | ${false}       | ${true}   | ${'1.23K'}
  `(
    'formatAmount returns $expected for $amount with $notation notation',
    ({ amount, notation, displayThreshold, tokenPrecision, isInteger, expected }) => {
      const options = { notation, displayThreshold, tokenPrecision, isInteger }
      const actual = formatAmount(amount, options)
      expect(actual).toBe(expected)
    },
  )
})
