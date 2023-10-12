import BigNumber from 'bignumber.js'
import { DeserializedFarm } from '@pancakeswap/farms'

export const getStakedMinProgramFarms = (farmsData: DeserializedFarm[]): DeserializedFarm[] => {
  return farmsData.filter((farm) => {
    return (
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm?.userData?.proxy?.stakedBalance ?? 0).isGreaterThan(0))
    )
  })
}
