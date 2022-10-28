import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { PoolIds } from 'config/constants/types'
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

  const vestingPercentage = useMemo(
    () => new BigNumber(publicPool.vestingInformation.percentage).times(0.01),
    [publicPool],
  )

  const releasedAtSaleEnd = useMemo(() => {
    return new BigNumber(userPool.offeringAmountInToken).times(new BigNumber(1).minus(vestingPercentage))
  }, [userPool, vestingPercentage])

  const amountReleased = useMemo(() => {
    return new BigNumber(releasedAtSaleEnd).plus(userPool.vestingReleased).plus(userPool.vestingComputeReleasableAmount)
  }, [userPool, releasedAtSaleEnd])

  const amountInVesting = useMemo(() => {
    return new BigNumber(userPool.offeringAmountInToken).minus(amountReleased)
  }, [userPool, amountReleased])

  const amountAvailableToClaim = useMemo(() => {
    return userPool.isVestingInitialized ? userPool.vestingComputeReleasableAmount : releasedAtSaleEnd
  }, [userPool, releasedAtSaleEnd])

  const amountAlreadyClaimed = useMemo(() => {
    const released = userPool.isVestingInitialized ? releasedAtSaleEnd : BIG_ZERO
    return new BigNumber(released).plus(userPool.vestingReleased)
  }, [releasedAtSaleEnd, userPool])

  return {
    vestingPercentage,
    releasedAtSaleEnd,
    amountReleased,
    amountInVesting,
    amountAvailableToClaim,
    amountAlreadyClaimed,
  }
}

export default useIfoVesting
