import BigNumber from 'bignumber.js'
import { Farm, Pool } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

type UserData =
  | Pool['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

export const transformPool = (pool: Pool): Pool => {
  const { totalStaked, stakingLimit, userData, ...rest } = pool

  return {
    ...rest,
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
  } as Pool
}

export const getTokenPricesFromFarm = (farms: Farm[]) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = getAddress(farm.quoteToken.address).toLocaleLowerCase()
    const tokenAddress = getAddress(farm.token.address).toLocaleLowerCase()
    /* eslint-disable no-param-reassign */
    if (!prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteToken.busdPrice).toNumber()
    }
    if (!prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.token.busdPrice).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}
