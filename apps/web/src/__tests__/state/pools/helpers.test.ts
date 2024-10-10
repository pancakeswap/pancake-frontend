import BigNumber from 'bignumber.js'
import { transformUserData } from 'state/pools/helpers'

describe('transformUserData', () => {
  it.each([
    [
      {
        allowance: new BigNumber(0),
        stakingTokenBalance: new BigNumber(0),
        stakedBalance: new BigNumber(0),
        pendingReward: new BigNumber(0),
      },
      {
        allowance: 0,
        stakingTokenBalance: 0,
        stakedBalance: 0,
        pendingReward: 0,
      },
      {
        allowance: '0',
        stakingTokenBalance: '0',
        stakedBalance: '0',
        pendingReward: '0',
      },
      {
        allowance: '0',
        stakingTokenBalance: '0',
      },
      {},
      {
        randomKey: 1,
      },
    ],
  ])('transforms user data correctly', (value) => {
    const userData = transformUserData(value)

    Object.values(userData).forEach((userDataValue) => {
      expect(userDataValue).toBeInstanceOf(BigNumber)
    })

    expect(userData).toHaveProperty('allowance')
    expect(userData).toHaveProperty('stakingTokenBalance')
    expect(userData).toHaveProperty('stakedBalance')
    expect(userData).toHaveProperty('pendingReward')
  })
})
