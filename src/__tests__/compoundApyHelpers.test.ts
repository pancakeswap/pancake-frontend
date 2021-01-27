import { calculateCakePerThousand } from '../utils/compoundApyHelpers'

it.each([
  [{ numberOfDays: 1, apy: 365, cakePrice: 1 }, 10],
  //   [{ numberOfDays: 1, apy: 20, cakePrice: 1 }, 10],
  //   [{ numberOfDays: 1, apy: 365, cakePrice: 1 }, 10],
])('calculate cake earned with values %o', ({ numberOfDays, apy, cakePrice }, expected) => {
  expect(calculateCakePerThousand({ numberOfDays, apy, cakePrice })).toEqual(expected)
})
