import { getPoolApy } from 'utils/apy'

describe('getPoolApy', () => {
  it(`returns null when parameters are missing`, () => {
    const apy = getPoolApy(null, null, null, null)
    expect(apy).toBeNull()
  })
  it(`returns null when APY is infinite`, () => {
    const apy = getPoolApy(0, 0, 0, 0)
    expect(apy).toBeNull()
  })
  it(`get the correct pool APY`, () => {
    const apy = getPoolApy(10, 1, 100000, 1)
    expect(apy).toEqual(1051.2)
  })
})
