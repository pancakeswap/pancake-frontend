import BigNumber from 'bignumber.js'
import { PoolIds } from 'config/constants/types'
import { useFetchUserWalletIfoData } from './useFetchUserWalletIfoData'

const useFetchVestingData = () => {
  const currentTimeStamp = new Date().getTime()
  const allData = useFetchUserWalletIfoData()

  const filterVestingIfos = allData.filter((ifo) => {
    const { userVestingData } = ifo

    const poolUnlimitedUserInfo = userVestingData[PoolIds.poolUnlimited]

    const hasClaimedAmount = poolUnlimitedUserInfo?.offeringAmountInToken.gt(0)
    const hasReleasableAmount = poolUnlimitedUserInfo?.vestingComputeReleasableAmount.gt(0)

    if (hasClaimedAmount) {
      if (hasReleasableAmount) {
        return true
      }

      const vestingStartTime = new BigNumber(userVestingData.vestingStartTime)
      const isPoolUnlimitedLive = vestingStartTime
        .plus(poolUnlimitedUserInfo.vestingInformationDuration)
        .times(1000)
        .gte(currentTimeStamp)

      if (isPoolUnlimitedLive) return true

      return false
    }

    return false
  })

  return filterVestingIfos
}

export default useFetchVestingData
