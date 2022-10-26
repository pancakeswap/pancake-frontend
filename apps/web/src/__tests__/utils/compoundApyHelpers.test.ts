import { getInterestBreakdown, getRoi, getPrincipalForInterest, getApy } from '@pancakeswap/utils/compoundApyHelpers'

const TWICE_PER_DAY = 2
const FIVE_THOUSAND_TIMES_PER_DAY = 5000
const ONCE_PER_7_DAYS = 0.142857142
const ONCE_PER_30_DAYS = 0.033333333

it.each([
  [
    { principalInUSD: 1000, apr: 120, earningTokenPrice: 16, performanceFee: 0, compoundFrequency: 1 },
    [0.205, 1.453, 6.467, 144.599, 24904.871],
  ],
  [
    { principalInUSD: 1000, apr: 120, earningTokenPrice: 16, performanceFee: 0, compoundFrequency: 2 },
    [0.206, 1.454, 6.473, 144.803, 25027.897],
  ],
  [
    { principalInUSD: 1000, apr: 120, earningTokenPrice: 16, performanceFee: 0, compoundFrequency: ONCE_PER_7_DAYS },
    [0.203, 1.438, 6.402, 142.204, 23494.228],
  ],
  [
    { principalInUSD: 1000, apr: 120, earningTokenPrice: 16, performanceFee: 0, compoundFrequency: ONCE_PER_30_DAYS },
    [0.196, 1.387, 6.164, 133.794, 19036.623],
  ],
  [
    { principalInUSD: 55000, apr: 120, earningTokenPrice: 5.5, performanceFee: 0, compoundFrequency: 1 },
    [32.877, 232.419, 1034.795, 23135.884, 3984779.424],
  ],
  [
    { principalInUSD: 55000, apr: 120, earningTokenPrice: 5.5, performanceFee: 0, compoundFrequency: TWICE_PER_DAY },
    [32.904, 232.612, 1035.687, 23168.475, 4004463.461],
  ],
  [
    { principalInUSD: 55000, apr: 120, earningTokenPrice: 5.5, performanceFee: 2, compoundFrequency: 1 },
    [32.219, 227.771, 1014.099, 22673.166, 3905083.836],
  ],
  [
    {
      principalInUSD: 55000,
      apr: 120,
      earningTokenPrice: 5.5,
      performanceFee: 2,
      compoundFrequency: FIVE_THOUSAND_TIMES_PER_DAY,
    },
    [32.272, 228.149, 1015.848, 22737.133, 3943794.378],
  ],
])(
  'calculate cake earned with values %o',
  ({ principalInUSD, apr, earningTokenPrice, compoundFrequency, performanceFee }, expected) => {
    expect(getInterestBreakdown({ principalInUSD, apr, earningTokenPrice, compoundFrequency, performanceFee })).toEqual(
      expected,
    )
  },
)

it.each([
  [{ amountEarned: 10, amountInvested: 1000 }, 1],
  [{ amountEarned: 4.8, amountInvested: 10 }, 48],
  [{ amountEarned: 217.48, amountInvested: 950 }, 22.892631578947366],
  [{ amountEarned: 100.67, amountInvested: 100 }, 100.66999999999999],
  [{ amountEarned: 8572.84, amountInvested: 20000 }, 42.864200000000004],
])('calculate roi % with values %o', ({ amountEarned, amountInvested }, expected) => {
  expect(getRoi({ amountEarned, amountInvested })).toEqual(expected)
})

it.each`
  apr      | compoundFrequency  | performanceFee | days   | expectedApy
  ${68.43} | ${0}               | ${0}           | ${365} | ${0.6843}
  ${68.43} | ${1}               | ${0}           | ${365} | ${0.9811}
  ${68.43} | ${ONCE_PER_7_DAYS} | ${0}           | ${365} | ${0.9736}
  ${68.43} | ${1}               | ${2}           | ${365} | ${0.9615}
  ${68.43} | ${1}               | ${100}         | ${365} | ${0}
  ${68.43} | ${1}               | ${0}           | ${30}  | ${0.0578}
  ${68.43} | ${1}               | ${2}           | ${30}  | ${0.0566}
  ${68.43} | ${1}               | ${0}           | ${1}   | ${0.00187}
`(
  'getApy returns $expectedApy for apr=$apr, compoundFrequency=$compoundFrequency, days=$days, performanceFee=$performanceFee',
  ({ apr, compoundFrequency, performanceFee, days, expectedApy }) => {
    const DIFFERENCE_THRESHOLD_IN_PERCENTS = 0.0001 // 0.01% error is OK
    const apy = getApy(apr, compoundFrequency, days, performanceFee)
    const difference = Math.abs(apy - expectedApy)
    expect(difference).toBeLessThanOrEqual(DIFFERENCE_THRESHOLD_IN_PERCENTS)
  },
)

it.each`
  principalInUSD | apr      | earningTokenPrice | compoundFrequency   | performanceFee
  ${84047.16}    | ${68.43} | ${17.12}          | ${1}                | ${0}
  ${25000}       | ${68.43} | ${17.12}          | ${1}                | ${0}
  ${25000}       | ${68.43} | ${17.12}          | ${TWICE_PER_DAY}    | ${0}
  ${25000}       | ${68.43} | ${17.12}          | ${ONCE_PER_7_DAYS}  | ${0}
  ${30000}       | ${68.43} | ${17.12}          | ${ONCE_PER_30_DAYS} | ${0}
  ${30000}       | ${68.43} | ${17.12}          | ${1}                | ${2}
  ${10000}       | ${312.5} | ${1.12}           | ${1}                | ${0}
  ${10000}       | ${277.2} | ${0.00000012}     | ${1}                | ${0}
  ${10000}       | ${256.1} | ${0.0012}         | ${1}                | ${0}
  ${320000}      | ${42.0}  | ${42069.69}       | ${1}                | ${0}
  ${320000}      | ${35.0}  | ${112000.0}       | ${1}                | ${0}
  ${70000}       | ${112.9} | ${22.62}          | ${0}                | ${0}
`(
  'reverse calculations match for p=$principalInUSD, apr=$apr, earningTokenPrice=$earningTokenPrice, compoundFrequency=$compoundFrequency, performanceFee=$performanceFee',
  ({ principalInUSD, apr, earningTokenPrice, compoundFrequency, performanceFee }) => {
    const DIFFERENCE_THRESHOLD_IN_PERCENTS = 0.00099 // 0.099%
    // 1. Calculate interests for given parameters
    const interestBreakdown = getInterestBreakdown({
      principalInUSD,
      apr,
      earningTokenPrice,
      compoundFrequency,
      performanceFee,
    })
    const interestBreakdownAsUSD = interestBreakdown.map((interest) => interest * earningTokenPrice)
    // 2. Calculate principal for same parameters and check if it matches the above
    interestBreakdownAsUSD.forEach((interest: number, index: number) => {
      const principalBreakdown = getPrincipalForInterest(interest, apr, compoundFrequency, performanceFee)
      const principalForInvestment = principalBreakdown[index]
      const difference = Math.abs(principalForInvestment - principalInUSD)
      const differenceAsPercentage = difference / principalInUSD
      expect(differenceAsPercentage).toBeLessThanOrEqual(DIFFERENCE_THRESHOLD_IN_PERCENTS)
    })
  },
)
