import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'

it.each([
  [{ numberOfDays: 1, farmApr: 365, tokenPrice: 1, performanceFee: 20 }, 8],
  [{ numberOfDays: 7, farmApr: 20, tokenPrice: 0.8, performanceFee: 1 }, 4.75],
  [{ numberOfDays: 40, farmApr: 212.21, tokenPrice: 1.2, performanceFee: 2 }, 212.63],
  [{ numberOfDays: 330, farmApr: 45.12, tokenPrice: 5, performanceFee: 5 }, 94.6],
  [{ numberOfDays: 365, farmApr: 100, tokenPrice: 0.2, performanceFee: 0 }, 8572.84],
  [{ numberOfDays: 365, farmApr: 20, tokenPrice: 1, performanceFee: 0 }, 221.34],
])('calculate cake earned with values %o', ({ numberOfDays, farmApr, tokenPrice, performanceFee }, expected) => {
  expect(tokenEarnedPerThousandDollarsCompounding({ numberOfDays, farmApr, tokenPrice, performanceFee })).toEqual(
    expected,
  )
})

it.each([
  [{ amountEarned: 10, amountInvested: 1000 }, 1],
  [{ amountEarned: 4.8, amountInvested: 10 }, 48],
  [{ amountEarned: 217.48, amountInvested: 950 }, 22.892631578947366],
  [{ amountEarned: 100.67, amountInvested: 100 }, 100.66999999999999],
  [{ amountEarned: 8572.84, amountInvested: 20000 }, 42.864200000000004],
])('calculate roi % with values %o', ({ amountEarned, amountInvested }, expected) => {
  expect(getRoi({ amountEarned, amountInvested })).toEqual(expected)
})
