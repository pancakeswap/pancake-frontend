import { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useGetApiPrice } from 'state/hooks'
import { useCakeVaultContract } from 'hooks/useContract'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getCakeAddress } from 'utils/addressHelpers'

const useGetVaultBountyInfo = (refresh?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [estimatedCallBountyReward, setEstimatedCallBountyReward] = useState(null)
  const [totalPendingCakeRewards, setTotalPendingCakeRewards] = useState(null)
  const [dollarCallBountyToDisplay, setDollarBountyToDisplay] = useState(null)
  const [cakeCallBountyToDisplay, setCakeBountyToDisplay] = useState(null)

  const stakingTokenPrice = useGetApiPrice(getCakeAddress())

  useEffect(() => {
    // Call contract to get estimated rewards
    const calculateHarvestCakeRewards = async () => {
      const estimatedRewards = await cakeVaultContract.methods.calculateHarvestCakeRewards().call()
      setEstimatedCallBountyReward(new BigNumber(estimatedRewards))
    }
    calculateHarvestCakeRewards()
  }, [cakeVaultContract, refresh])

  useEffect(() => {
    // Call contract to get total pending cake rewards (doesn't update on refresh)
    const calculateTotalPendingCakeRewards = async () => {
      const pendingCakeRewards = await cakeVaultContract.methods.calculateTotalPendingCakeRewards().call()
      setTotalPendingCakeRewards(new BigNumber(pendingCakeRewards))
    }
    calculateTotalPendingCakeRewards()
  }, [cakeVaultContract])

  useEffect(() => {
    // Convert estimated rewards to dollars and a cake display value
    if (estimatedCallBountyReward && stakingTokenPrice) {
      // Reduce decimals for production
      const estimatedDollars = getFullDisplayBalance(estimatedCallBountyReward.multipliedBy(stakingTokenPrice), 18, 4)
      // Reduce decimals for production
      const estimatedCake = getFullDisplayBalance(estimatedCallBountyReward, 18, 8)
      setDollarBountyToDisplay(estimatedDollars)
      setCakeBountyToDisplay(estimatedCake)
    }
  }, [stakingTokenPrice, estimatedCallBountyReward])

  return { estimatedCallBountyReward, dollarCallBountyToDisplay, cakeCallBountyToDisplay, totalPendingCakeRewards }
}

export default useGetVaultBountyInfo
