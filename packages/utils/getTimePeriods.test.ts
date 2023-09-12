import getTimePeriods from './getTimePeriods'

it.each([
  [40, { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 40, totalDays: 0 }],
  [60, { years: 0, months: 0, days: 0, hours: 0, minutes: 1, seconds: 0, totalDays: 0 }],
  [70, { years: 0, months: 0, days: 0, hours: 0, minutes: 1, seconds: 10, totalDays: 0 }],
  [691200, { years: 0, months: 0, days: 8, hours: 0, minutes: 0, seconds: 0, totalDays: 8 }],
  [5259600, { years: 0, months: 2, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 60 }],
  [94672800, { years: 3, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 1095 }],
  [34277461, { years: 1, months: 1, days: 1, hours: 1, minutes: 1, seconds: 1, totalDays: 396 }],
])('format %i seconds', (seconds, expected) => {
  expect(getTimePeriods(seconds)).toEqual(expected)
})
