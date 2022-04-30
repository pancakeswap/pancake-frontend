import {
  getAmountChange,
  getPercentChange,
  getChangeForPeriod,
  getLpFeesAndApr,
} from 'views/Info/utils/infoDataHelpers'

describe('info/utils/infoDataHelpers', () => {
  it.each`
    valueNow     | valueBefore  | expected
    ${undefined} | ${undefined} | ${0}
    ${1234}      | ${undefined} | ${1234}
    ${1000}      | ${11}        | ${989}
    ${1234}      | ${123}       | ${1111}
    ${1234.69}   | ${123.45}    | ${1111.24}
    ${200}       | ${350}       | ${-150}
  `('getAmountChange returns $expected for $valueNow and $valueBefore', ({ valueNow, valueBefore, expected }) => {
    const actual = getAmountChange(valueNow, valueBefore)
    expect(actual).toBe(expected)
  })

  it.each`
    valueNow     | valueBefore  | expected
    ${undefined} | ${undefined} | ${0}
    ${1234}      | ${undefined} | ${0}
    ${100}       | ${50}        | ${100}
    ${100}       | ${80}        | ${25}
    ${100}       | ${200}       | ${-50}
    ${100}       | ${400}       | ${-75}
    ${100}       | ${100}       | ${0}
  `('getPercentChange returns $expected for $valueNow and $valueBefore', ({ valueNow, valueBefore, expected }) => {
    const actual = getPercentChange(valueNow, valueBefore)
    expect(actual).toBe(expected)
  })

  it.each`
    valueNow     | valueOnePeriodAgo | valueTwoPeriodsAgo | expected
    ${undefined} | ${undefined}      | ${undefined}       | ${[0, 0]}
    ${100}       | ${undefined}      | ${undefined}       | ${[100, 0]}
    ${100}       | ${50}             | ${undefined}       | ${[50, 0]}
    ${100}       | ${20}             | ${undefined}       | ${[80, 300]}
    ${100}       | ${20}             | ${10}              | ${[80, 700]}
    ${100}       | ${90}             | ${70}              | ${[10, -50]}
  `(
    'getChangeForPeriod returns $expected for $valueNow, $valueOnePeriodAgo and $valueTwoPeriodsAgo',
    ({ valueNow, valueOnePeriodAgo, valueTwoPeriodsAgo, expected }) => {
      const actual = getChangeForPeriod(valueNow, valueOnePeriodAgo, valueTwoPeriodsAgo)
      expect(actual).toStrictEqual(expected)
    },
  )

  it.each`
    volumeUSD | volumeUSDWeek | liquidityUSD | expected
    ${0} | ${0} | ${0} | ${{
  totalFees24h: 0,
  totalFees7d: 0,
  lpFees24h: 0,
  lpFees7d: 0,
  lpApr7d: 0,
}}
    ${100} | ${0} | ${0} | ${{
  totalFees24h: 0.25,
  totalFees7d: 0,
  lpFees24h: 0.17,
  lpFees7d: 0,
  lpApr7d: 0,
}}
    ${100} | ${1000} | ${0} | ${{
  totalFees24h: 0.25,
  totalFees7d: 2.5,
  lpFees24h: 0.17,
  lpFees7d: 1.7,
  lpApr7d: 0,
}}
    ${1000} | ${10000} | ${1000} | ${{
  totalFees24h: 2.5,
  totalFees7d: 25,
  lpFees24h: 1.7,
  lpFees7d: 17,
  lpApr7d: 88.64,
}}
  `(
    'getLpFeesAndApr returns expected fees and APR for $volumeUSD, $volumeUSDWeek and $liquidityUSD',
    ({ volumeUSD, volumeUSDWeek, liquidityUSD, expected }) => {
      const actual = getLpFeesAndApr(volumeUSD, volumeUSDWeek, liquidityUSD)
      // Round actual to avoid rounding errors during comparison
      Object.keys(actual).forEach((key) => {
        actual[key] = parseFloat(actual[key].toFixed(2))
      })
      expect(actual).toStrictEqual(expected)
    },
  )
})
