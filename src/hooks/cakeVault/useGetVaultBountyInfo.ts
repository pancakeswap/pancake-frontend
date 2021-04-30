import { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useGetApiPrice } from 'state/hooks'
import { useCakeVaultContract } from 'hooks/useContract'
import { getFullDisplayBalance } from 'utils/formatBalance'
import makeBatchRequest from 'utils/makeBatchRequest'
import { getCakeAddress } from 'utils/addressHelpers'

const useGetVaultBountyInfo = (refresh?: number) => {
  const cakeVaultContract = useCakeVaultContract()
  const [estimatedCallBountyReward, setEstimatedCallBountyReward] = useState(null)
  const [totalPendingCakeRewards, setTotalPendingCakeRewards] = useState(null)
  const [dollarCallBountyToDisplay, setDollarBountyToDisplay] = useState(null)
  const [cakeCallBountyToDisplay, setCakeBountyToDisplay] = useState(null)

  const cakePrice = useGetApiPrice(getCakeAddress())

  useEffect(() => {
    // Call contract to get estimated rewards
    const fetchRewards = async () => {
      const [estimatedRewards, pendingCakeRewards] = await makeBatchRequest([
        cakeVaultContract.methods.calculateHarvestCakeRewards().call,
        cakeVaultContract.methods.calculateTotalPendingCakeRewards().call,
      ])
      setEstimatedCallBountyReward(new BigNumber(estimatedRewards as string))
      setTotalPendingCakeRewards(new BigNumber(pendingCakeRewards as string))
    }
    fetchRewards()
  }, [cakeVaultContract, refresh])

  useEffect(() => {
    // Convert estimated rewards to dollars and a cake display value
    if (estimatedCallBountyReward && cakePrice) {
      const dollarValueOfReward = estimatedCallBountyReward.multipliedBy(cakePrice)
      const estimatedDollars = getFullDisplayBalance(dollarValueOfReward, 18, 2)
      const estimatedCake = getFullDisplayBalance(estimatedCallBountyReward, 18, 3)
      setDollarBountyToDisplay(estimatedDollars)
      setCakeBountyToDisplay(estimatedCake)
    }
  }, [cakePrice, estimatedCallBountyReward])

  return { estimatedCallBountyReward, dollarCallBountyToDisplay, cakeCallBountyToDisplay, totalPendingCakeRewards }
}

export default useGetVaultBountyInfo
