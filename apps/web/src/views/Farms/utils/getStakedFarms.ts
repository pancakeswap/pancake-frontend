import BigNumber from 'bignumber.js'
import { V2FarmWithoutStakedValue, V3FarmWithoutStakedValue } from 'state/farms/types'

export const getStakedFarms = (
  farmsData: (V3FarmWithoutStakedValue | V2FarmWithoutStakedValue)[],
): (V3FarmWithoutStakedValue | V2FarmWithoutStakedValue)[] => {
  return farmsData.filter((farm) => {
    if (farm.version === 3) {
      return farm.stakedPositions.length > 0
    }
    const isBooster = Boolean(farm?.bCakeWrapperAddress)
    return isBooster
      ? new BigNumber(farm?.bCakeUserData?.stakedBalance ?? 0).gt(0)
      : new BigNumber(farm?.userData?.stakedBalance ?? 0).gt(0) ||
          new BigNumber(farm?.userData?.proxy?.stakedBalance ?? 0).gt(0)
  })
}
