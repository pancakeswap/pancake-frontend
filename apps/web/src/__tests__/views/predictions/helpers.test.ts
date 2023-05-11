import { formatRoundTime, padTime, formatTokenv2, formatUsdv2 } from 'views/Predictions/helpers'

describe('padTime', () => {
  it.each([
    [1, '01'],
    [9, '09'],
    [299, '299'],
    [0.3, '0.3'],
  ])('correctly pads %i', (value, expected) => {
    expect(padTime(value)).toEqual(expected)
  })
})

describe('formatRoundTime', () => {
  it.each([
    [55, '00:55'],
    [70, '01:10'],
    [4501, '01:15:01'],
  ])('given seconds (%i) returns correctly formatted time', (value, expected) => {
    expect(formatRoundTime(value)).toEqual(expected)
  })
})

describe('formatUsdv2', () => {
  it.each`
    priceDifference | expectedPriceDifferenceFormatted
    ${10}           | ${'<$0.0001'}
    ${100}          | ${'<$0.0001'}
    ${1000}         | ${'<$0.0001'}
    ${10000}        | ${'$0.0001'}
    ${100000}       | ${'$0.0010'}
    ${1000000}      | ${'$0.0100'}
    ${10000000}     | ${'$0.1000'}
    ${100000000}    | ${'$1.0000'}
    ${1000000000}   | ${'$10.0000'}
    ${10000000000}  | ${'$100.0000'}
    ${-10000000000} | ${'$-100.0000'}
    ${-1000000000}  | ${'$-10.0000'}
    ${-100000000}   | ${'$-1.0000'}
    ${-10000000}    | ${'$-0.1000'}
    ${-1000000}     | ${'$-0.0100'}
    ${-100000}      | ${'$-0.0010'}
    ${-10000}       | ${'$-0.0001'}
    ${-1000}        | ${'<$-0.0001'}
    ${-100}         | ${'<$-0.0001'}
    ${-10}          | ${'<$-0.0001'}
  `(
    'should format $priceDifference to $expectedPriceDifferenceFormatted',
    ({ priceDifference, expectedPriceDifferenceFormatted }) =>
      expect(formatUsdv2(BigInt(priceDifference), 4)).toEqual(expectedPriceDifferenceFormatted),
  )
})

describe('formatTokenv2', () => {
  it.each`
    priceDifference             | expectedPriceDifferenceFormatted
    ${'1000000000000'}          | ${'<0.0001'}
    ${'10000000000000'}         | ${'<0.0001'}
    ${'100000000000000'}        | ${'0.0001'}
    ${'1000000000000000'}       | ${'0.0010'}
    ${'10000000000000000'}      | ${'0.0100'}
    ${'100000000000000000'}     | ${'0.1000'}
    ${'1000000000000000000'}    | ${'1.0000'}
    ${'10000000000000000000'}   | ${'10.0000'}
    ${'100000000000000000000'}  | ${'100.0000'}
    ${'-100000000000000000000'} | ${'-100.0000'}
    ${'-10000000000000000000'}  | ${'-10.0000'}
    ${'-1000000000000000000'}   | ${'-1.0000'}
    ${'-100000000000000000'}    | ${'-0.1000'}
    ${'-10000000000000000'}     | ${'-0.0100'}
    ${'-1000000000000000'}      | ${'-0.0010'}
    ${'-100000000000000'}       | ${'-0.0001'}
    ${'-10000000000000'}        | ${'<-0.0001'}
    ${'-1000000000000'}         | ${'<-0.0001'}
    ${'-100000000000'}          | ${'<-0.0001'}
  `(
    'should format $priceDifference to $expectedPriceDifferenceFormatted',
    ({ priceDifference, expectedPriceDifferenceFormatted }) =>
      expect(formatTokenv2(BigInt(priceDifference), 18, 4)).toEqual(expectedPriceDifferenceFormatted),
  )
})
