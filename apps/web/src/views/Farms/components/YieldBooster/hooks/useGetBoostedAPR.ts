import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useCakeVaultPublicData, useCakeVaultUserData } from 'state/pools/hooks'
import { getBCakeMultiplier } from 'views/Farms/components/YieldBooster/components/BCakeCalculator'
import { useUserLockedCakeStatus } from 'views/Farms/hooks/useUserLockedCakeStatus'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'
import { secondsToDays } from 'views/Pools/components/utils/formatSecondsToWeeks'

export const useGetBoostedMultiplier = (userBalanceInFarm: BigNumber, lpTokenStakedAmount: BigNumber) => {
  useCakeVaultPublicData()
  useCakeVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, lockedAmount, totalLockedAmount, lockedStart, lockedEnd } = useUserLockedCakeStatus()
  const bCakeMultiplier = useMemo(() => {
    const result = getBCakeMultiplier(
      userBalanceInFarm, // userBalanceInFarm,
      lockedAmount, // userLockAmount
      secondsToDays(_toNumber(lockedEnd) - _toNumber(lockedStart)), // userLockDuration
      totalLockedAmount, // totalLockAmount
      lpTokenStakedAmount, // lpBalanceOfFarm
      avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration
    )
    return result.toString() === 'NaN' || isLoading ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    lockedEnd,
    lockedStart,
    isLoading,
  ])
  return _toNumber(bCakeMultiplier)
}

export const useGetCalculatorMultiplier = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  lockedAmount: BigNumber,
  userLockDuration: number,
) => {
  useCakeVaultPublicData()
  useCakeVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, totalLockedAmount } = useUserLockedCakeStatus()
  const bCakeMultiplier = useMemo(() => {
    const result = getBCakeMultiplier(
      userBalanceInFarm, // userBalanceInFarm,
      lockedAmount, // userLockAmount
      secondsToDays(userLockDuration), // userLockDuration
      totalLockedAmount, // totalLockAmount
      lpTokenStakedAmount, // lpBalanceOfFarm
      avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration
    )
    return result.toString() === 'NaN' || isLoading ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    isLoading,
    userLockDuration,
  ])
  return _toNumber(bCakeMultiplier)
}

const useGetBoostedAPR = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  apr: number,
  lpRewardsApr: number,
) => {
  const bCakeMultiplier = useGetBoostedMultiplier(userBalanceInFarm, lpTokenStakedAmount)
  return (apr * bCakeMultiplier + lpRewardsApr).toFixed(2)
}

export default useGetBoostedAPR
