import { calculateCakePerThousand } from '../utils/compoundApyHelpers'

it.each([[{ numberOfDays: 1, apy: 100, cakePrice: 1 }, 2]])(
  'calculate cake earned after %i days, at ',
  ({ numberOfDays, apy, cakePrice }, expected) => {
    expect(calculateCakePerThousand({ numberOfDays, apy, cakePrice })).toEqual(expected)
  },
)
