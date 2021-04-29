import BigNumber from 'bignumber.js'
import { getPoolApr, getFarmApr } from 'utils/apr'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

describe('getPoolApr', () => {
  it(`returns null when parameters are missing`, () => {
    const apr = getPoolApr(null, null, null, null)
    expect(apr).toBeNull()
  })
  it(`returns null when APR is infinite`, () => {
    const apr = getPoolApr(0, 0, 0, 0)
    expect(apr).toBeNull()
  })
  it(`get the correct pool APR`, () => {
    const apr = getPoolApr(10, 1, 100000, 1)
    expect(apr).toEqual(1051.2)
  })
})

describe('getFarmApr', () => {
  it(`returns null when parameters are missing`, () => {
    const apr = getFarmApr(null, null, null)
    expect(apr).toBeNull()
  })
  it(`returns null when APR is infinite`, () => {
    const apr = getFarmApr(BIG_ZERO, BIG_ZERO, BIG_ZERO)
    expect(apr).toBeNull()
  })
  it(`get the correct pool APR`, () => {
    const apr = getFarmApr(BIG_TEN, new BigNumber(1), new BigNumber(100000))
    expect(apr).toEqual(4204800)
  })
})
