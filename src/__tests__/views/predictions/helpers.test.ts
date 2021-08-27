import { formatRoundTime, padTime } from 'views/Predictions/helpers'

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
