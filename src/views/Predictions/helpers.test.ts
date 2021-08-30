import { BigNumber } from 'ethers'
import { formatBnbv2, formatUsdv2 } from './helpers'

describe('formatUsdv2', () => {
  it.each`
    priceDifference | expectedPriceDifferenceFormatted
    ${10}           | ${'<$0.001'}
    ${100}          | ${'<$0.001'}
    ${1000}         | ${'<$0.001'}
    ${10000}        | ${'<$0.001'}
    ${100000}       | ${'$0.001'}
    ${1000000}      | ${'$0.010'}
    ${10000000}     | ${'$0.100'}
    ${100000000}    | ${'$1.000'}
    ${1000000000}   | ${'$10.000'}
    ${10000000000}  | ${'$100.000'}
    ${-10000000000} | ${'$-100.000'}
    ${-1000000000}  | ${'$-10.000'}
    ${-100000000}   | ${'$-1.000'}
    ${-10000000}    | ${'$-0.100'}
    ${-1000000}     | ${'$-0.010'}
    ${-100000}      | ${'$-0.001'}
    ${-10000}       | ${'<$-0.001'}
    ${-1000}        | ${'<$-0.001'}
    ${-100}         | ${'<$-0.001'}
    ${-10}          | ${'<$-0.001'}
  `(
    'should format $priceDifference to $expectedPriceDifferenceFormatted',
    ({ priceDifference, expectedPriceDifferenceFormatted }) =>
      expect(formatUsdv2(BigNumber.from(priceDifference))).toEqual(expectedPriceDifferenceFormatted),
  )
})

describe('formatBnbv2', () => {
  it.each`
    priceDifference             | expectedPriceDifferenceFormatted
    ${'1000000000000'}          | ${'<0.001'}
    ${'10000000000000'}         | ${'<0.001'}
    ${'100000000000000'}        | ${'<0.001'}
    ${'1000000000000000'}       | ${'0.001'}
    ${'10000000000000000'}      | ${'0.010'}
    ${'100000000000000000'}     | ${'0.100'}
    ${'1000000000000000000'}    | ${'1.000'}
    ${'10000000000000000000'}   | ${'10.000'}
    ${'100000000000000000000'}  | ${'100.000'}
    ${'-100000000000000000000'} | ${'-100.000'}
    ${'-10000000000000000000'}  | ${'-10.000'}
    ${'-1000000000000000000'}   | ${'-1.000'}
    ${'-100000000000000000'}    | ${'-0.100'}
    ${'-10000000000000000'}     | ${'-0.010'}
    ${'-1000000000000000'}      | ${'-0.001'}
    ${'-100000000000000'}       | ${'<-0.001'}
    ${'-10000000000000'}        | ${'<-0.001'}
    ${'-1000000000000'}         | ${'<-0.001'}
    ${'-100000000000'}          | ${'<-0.001'}
  `(
    'should format $priceDifference to $expectedPriceDifferenceFormatted',
    ({ priceDifference, expectedPriceDifferenceFormatted }) =>
      expect(formatBnbv2(BigNumber.from(priceDifference))).toEqual(expectedPriceDifferenceFormatted),
  )
})
