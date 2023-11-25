import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { PoolIds } from '@pancakeswap/ifos'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

interface UseIfoVestingProps {
  poolId: PoolIds
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const useIfoVesting = ({ poolId, publicIfoData, walletIfoData }: UseIfoVestingProps) => {
  const publicPool = publicIfoData[poolId]
  const userPool = walletIfoData[poolId]
  const { vestingStartTime } = publicIfoData
  const vestingInformation = publicPool?.vestingInformation

  const isVestingOver = useMemo(() => {
    const currentTimeStamp = Date.now()
    const timeVestingEnd =
      vestingStartTime === 0 ? currentTimeStamp : ((vestingStartTime ?? 0) + (vestingInformation?.duration ?? 0)) * 1000
    return currentTimeStamp > timeVestingEnd
  }, [vestingStartTime, vestingInformation])

  const vestingPercentage = useMemo(
    () => new BigNumber(publicPool?.vestingInformation?.percentage ?? 0).times(0.01),
    [publicPool],
  )

  const releasedAtSaleEnd = useMemo(() => {
    return new BigNumber(userPool?.offeringAmountInToken ?? 0).times(new BigNumber(1).minus(vestingPercentage))
  }, [userPool, vestingPercentage])

  const amountReleased = useMemo(() => {
    return isVestingOver
      ? new BigNumber(userPool?.offeringAmountInToken ?? 0)
      : new BigNumber(releasedAtSaleEnd)
          .plus(userPool?.vestingReleased ?? 0)
          .plus(userPool?.vestingComputeReleasableAmount ?? 0)
  }, [isVestingOver, userPool, releasedAtSaleEnd])

  const amountInVesting = useMemo(() => {
    return isVestingOver ? BIG_ZERO : new BigNumber(userPool?.offeringAmountInToken ?? 0).minus(amountReleased)
  }, [userPool, amountReleased, isVestingOver])

  const amountAvailableToClaim = useMemo(() => {
    return userPool?.isVestingInitialized ? userPool.vestingComputeReleasableAmount : releasedAtSaleEnd
  }, [userPool, releasedAtSaleEnd])

  const amountAlreadyClaimed = useMemo(() => {
    const released = userPool?.isVestingInitialized ? releasedAtSaleEnd : BIG_ZERO
    return new BigNumber(released).plus(userPool?.vestingReleased ?? 0)
  }, [releasedAtSaleEnd, userPool])

  return {
    isVestingOver,
    vestingPercentage,
    releasedAtSaleEnd,
    amountReleased,
    amountInVesting,
    amountAvailableToClaim,
    amountAlreadyClaimed,
  }
}

export default useIfoVesting
