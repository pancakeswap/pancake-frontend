import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'

interface UseIfoVestingProps {
  poolId: PoolIds
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const useIfoVesting = ({ poolId, publicIfoData, walletIfoData }: UseIfoVestingProps) => {
  const publicPool = publicIfoData[poolId]
  const userPool = walletIfoData[poolId]

  const userVestingSheduleCount = useMemo(() => walletIfoData.vestingSchedule.countByBeneficiary, [walletIfoData])
  const vestingPercentage = useMemo(
    () => new BigNumber(publicPool.vestingInfomation.percentage).times(0.01),
    [publicPool],
  )

  const releasedAtSaleEnd = useMemo(() => {
    return new BigNumber(userPool.offeringAmountInToken).times(new BigNumber(1).minus(vestingPercentage))
  }, [userPool, vestingPercentage])

  const amountReleased = useMemo(() => {
    return new BigNumber(releasedAtSaleEnd).plus(userPool.vestingReleased).plus(userPool.vestingcomputeReleasableAmount)
  }, [userPool, releasedAtSaleEnd])

  const amountInVesting = useMemo(() => {
    return new BigNumber(userPool.offeringAmountInToken).minus(amountReleased)
  }, [userPool, amountReleased])

  const amountAvailableToClaim = useMemo(() => {
    return userVestingSheduleCount.gt(0) ? userPool.vestingcomputeReleasableAmount : releasedAtSaleEnd
  }, [userVestingSheduleCount, userPool, releasedAtSaleEnd])

  const amountAlreadyClaimed = useMemo(() => {
    const released = userVestingSheduleCount.gt(0) ? releasedAtSaleEnd : 0
    return new BigNumber(released).plus(userPool.vestingReleased)
  }, [userVestingSheduleCount, releasedAtSaleEnd, userPool])

  return {
    userVestingSheduleCount,
    vestingPercentage,
    releasedAtSaleEnd,
    amountReleased,
    amountInVesting,
    amountAvailableToClaim,
    amountAlreadyClaimed,
  }
}

export default useIfoVesting
