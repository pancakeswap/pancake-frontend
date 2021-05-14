import { useState, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useCakeVault, useGetApiPrice } from 'state/hooks'
import { getCakeAddress } from 'utils/addressHelpers'

const useGetVaultBountyInfo = () => {
  const [estimatedDollarBountyReward, setEstimatedDollarBountyReward] = useState(null)
  const {
    estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
    totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
  } = useCakeVault()
  const cakePrice = useGetApiPrice(getCakeAddress())

  const estimatedCakeBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyRewardAsString)
  }, [estimatedCakeBountyRewardAsString])
  const totalPendingCakeHarvest = new BigNumber(totalPendingCakeHarvestAsString)

  useEffect(() => {
    if (cakePrice) {
      const dollarValueOfClaimableReward = new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePrice)
      setEstimatedDollarBountyReward(dollarValueOfClaimableReward)
    }
  }, [cakePrice, estimatedCakeBountyReward])

  return { estimatedCakeBountyReward, estimatedDollarBountyReward, totalPendingCakeHarvest }
}

export default useGetVaultBountyInfo
