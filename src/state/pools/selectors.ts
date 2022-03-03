import BigNumber from 'bignumber.js'
import { createSelector } from '@reduxjs/toolkit'
import { transformPool } from './helpers'
import { initialPoolVaultState } from './index'

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector(
    (state: State) => ({
      pool: state.pools.data.find((p) => p.sousId === sousId),
      userDataLoaded: state.pools.userDataLoaded,
    }),
    ({ pool, userDataLoaded }) => {
      return { pool: transformPool(pool), userDataLoaded }
    },
  )

export const poolsWithUserDataLoadingSelector = createSelector(
  (state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }),
  ({ pools, userDataLoaded }) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) =>
  createSelector(
    (state: State) => (key ? state.pools[key] : initialPoolVaultState),
    (vault) => {
      const {
        totalShares: totalSharesAsString,
        pricePerFullShare: pricePerFullShareAsString,
        totalCakeInVault: totalCakeInVaultAsString,
        estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
        totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
        fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
        userData: {
          isLoading,
          userShares: userSharesAsString,
          cakeAtLastUserAction: cakeAtLastUserActionAsString,
          lastDepositedTime,
          lastUserActionTime,
        },
      } = vault

      const estimatedCakeBountyReward = new BigNumber(estimatedCakeBountyRewardAsString)
      const totalPendingCakeHarvest = new BigNumber(totalPendingCakeHarvestAsString)
      const totalShares = new BigNumber(totalSharesAsString)
      const pricePerFullShare = new BigNumber(pricePerFullShareAsString)
      const totalCakeInVault = new BigNumber(totalCakeInVaultAsString)
      const userShares = new BigNumber(userSharesAsString)
      const cakeAtLastUserAction = new BigNumber(cakeAtLastUserActionAsString)

      const performanceFeeAsDecimal = performanceFee && performanceFee / 100

      return {
        totalShares,
        pricePerFullShare,
        totalCakeInVault,
        estimatedCakeBountyReward,
        totalPendingCakeHarvest,
        fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod, performanceFeeAsDecimal },
        userData: {
          isLoading,
          userShares,
          cakeAtLastUserAction,
          lastDepositedTime,
          lastUserActionTime,
        },
      }
    },
  )
