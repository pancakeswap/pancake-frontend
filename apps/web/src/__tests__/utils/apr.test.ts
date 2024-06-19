import { ChainId } from '@pancakeswap/chains'
import { BIG_TEN, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import lpAprs from 'config/constants/lpAprs/56.json'
import { getFarmApr, getPoolApr } from 'utils/apr'
import { vi } from 'vitest'

vi.mock('../../config/constants/lpAprs/56.json', async () => {
  const actual = await vi.importActual('../../config/constants/lpAprs/56.json')
  // @ts-ignore
  return {
    default: {
      // @ts-ignore
      ...actual.default,
      '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0': 1.44123,
    },
  }
})

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
    const { cakeRewardsApr, lpRewardsApr } = getFarmApr(ChainId.BSC, null, null, null, null, 40)
    expect(cakeRewardsApr).toBeNull()
    expect(lpRewardsApr).toEqual(0)
  })
  it(`returns null when APR is infinite`, () => {
    const { cakeRewardsApr, lpRewardsApr } = getFarmApr(ChainId.BSC, BIG_ZERO, BIG_ZERO, BIG_ZERO, '', 40)
    expect(cakeRewardsApr).toBeNull()
    expect(lpRewardsApr).toEqual(0)
  })
  it(`get the correct pool APR`, () => {
    const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
      ChainId.BSC,
      BIG_TEN,
      new BigNumber(1),
      new BigNumber(100000),
      '',
      40,
    )
    expect(cakeRewardsApr).toEqual(4204800)
    expect(lpRewardsApr).toEqual(0)
  })
  it(`get the correct pool APR combined with LP APR`, () => {
    const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
      ChainId.BSC,
      BIG_TEN,
      new BigNumber(1),
      new BigNumber(100000),
      '0x0ed7e52944161450477ee417de9cd3a859b14fd0',
      40,
    )
    expect(cakeRewardsApr).toEqual(4204800)
    expect(lpRewardsApr).toEqual(lpAprs['0x0ed7e52944161450477ee417de9cd3a859b14fd0'])
  })
})
