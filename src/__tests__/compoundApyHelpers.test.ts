import { calculateCakeEarnedPerThousandDollars, apyModalRoi } from '../utils/compoundApyHelpers'

it.each([
  [{ numberOfDays: 1, farmApy: 365, cakePrice: 1 }, 10],
  [{ numberOfDays: 7, farmApy: 20, cakePrice: 0.8 }, 4.8],
  [{ numberOfDays: 40, farmApy: 212.21, cakePrice: 1.2 }, 217.48],
  [{ numberOfDays: 330, farmApy: 45.12, cakePrice: 5 }, 100.67],
  [{ numberOfDays: 365, farmApy: 100, cakePrice: 0.2 }, 8572.84],
  [{ numberOfDays: 365, farmApy: 20, cakePrice: 1 }, 221.34],
])('calculate cake earned with values %o', ({ numberOfDays, farmApy, cakePrice }, expected) => {
  expect(calculateCakeEarnedPerThousandDollars({ numberOfDays, farmApy, cakePrice })).toEqual(expected)
})

// it.each([
//   [10, 1000, '1.00'],
//   [4.8, 800, '0.60'],
//   [217.48, 1200, '18.12'],
//   [100.67, 5000, '2.01'],
//   [8572.84, 200, '4286.42'],
// ])(
//   'calculate roi % when %i cake is earned with a principal cost of %i',
//   (cakePerThousandDollars, costOfOneThousandCake, expected) => {
//     expect(apyModalRoi(cakePerThousandDollars, costOfOneThousandCake)).toEqual(expected)
//   },
// )
