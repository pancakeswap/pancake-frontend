import { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useGetApiPrice } from 'state/hooks'
import { useCakeVaultContract } from 'hooks/useContract'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getCakeAddress } from 'utils/addressHelpers'

const useGetVaultBountyInfo = (refresh?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [estimatedBountyReward, setEstimatedBountyReward] = useState(null)
  const [dollarBountyToDisplay, setDollarBountyToDisplay] = useState(null)
  const [cakeBountyToDisplay, setCakeBountyToDisplay] = useState(null)

  const stakingTokenPrice = useGetApiPrice(getCakeAddress())

  useEffect(() => {
    // Call contract to get estimated rewards
    const calculateEstimateRewards = async () => {
      const estimatedRewards = await cakeVaultContract.methods.calculateEstimateRewards().call()
      setEstimatedBountyReward(new BigNumber(estimatedRewards))
    }
    calculateEstimateRewards()
  }, [cakeVaultContract, refresh])

  useEffect(() => {
    // Convert estimated rewards to dollars and a cake display value
    if (estimatedBountyReward && stakingTokenPrice) {
      // Reduce decimals for production
      const estimatedDollars = getFullDisplayBalance(estimatedBountyReward.multipliedBy(stakingTokenPrice), 18, 4)
      // Reduce decimals for production
      const estimatedCake = getFullDisplayBalance(estimatedBountyReward, 18, 8)
      setDollarBountyToDisplay(estimatedDollars)
      setCakeBountyToDisplay(estimatedCake)
    }
  }, [stakingTokenPrice, estimatedBountyReward])

  return { estimatedBountyReward, dollarBountyToDisplay, cakeBountyToDisplay }
}

export default useGetVaultBountyInfo
