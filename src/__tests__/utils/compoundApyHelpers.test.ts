import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'

it.each([
  [{ numberOfDays: 1, farmApr: 365, tokenPrice: 1 }, 10],
  [{ numberOfDays: 7, farmApr: 20, tokenPrice: 0.8 }, 4.8],
  [{ numberOfDays: 40, farmApr: 212.21, tokenPrice: 1.2 }, 217.48],
  [{ numberOfDays: 330, farmApr: 45.12, tokenPrice: 5 }, 100.67],
  [{ numberOfDays: 365, farmApr: 100, tokenPrice: 0.2 }, 8572.84],
  [{ numberOfDays: 365, farmApr: 20, tokenPrice: 1 }, 221.34],
])('calculate cake earned with values %o', ({ numberOfDays, farmApr, tokenPrice }, expected) => {
  expect(tokenEarnedPerThousandDollarsCompounding({ numberOfDays, farmApr, tokenPrice })).toEqual(expected)
})

it.each([
  [{ amountEarned: 10, amountInvested: 1000 }, '1.00'],
  [{ amountEarned: 4.8, amountInvested: 10 }, '48.00'],
  [{ amountEarned: 217.48, amountInvested: 950 }, '22.89'],
  [{ amountEarned: 100.67, amountInvested: 100 }, '100.67'],
  [{ amountEarned: 8572.84, amountInvested: 20000 }, '42.86'],
])('calculate roi % with values %o', ({ amountEarned, amountInvested }, expected) => {
  expect(getRoi({ amountEarned, amountInvested })).toEqual(expected)
})
