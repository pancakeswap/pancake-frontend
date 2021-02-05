import getTimePeriods from 'utils/getTimePeriods'

it.each([
  [40, { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 40 }],
  [60, { years: 0, months: 0, days: 0, hours: 0, minutes: 1, seconds: 0 }],
  [70, { years: 0, months: 0, days: 0, hours: 0, minutes: 1, seconds: 10 }],
  [691200, { years: 0, months: 0, days: 8, hours: 0, minutes: 0, seconds: 0 }],
  [5259600, { years: 0, months: 2, days: 0, hours: 0, minutes: 0, seconds: 0 }],
  [94672800, { years: 3, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }],
  [34277461, { years: 1, months: 1, days: 1, hours: 1, minutes: 1, seconds: 1 }],
])('format %i seconds', (seconds, expected) => {
  expect(getTimePeriods(seconds)).toEqual(expected)
})
