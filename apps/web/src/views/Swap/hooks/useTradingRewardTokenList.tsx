import {
  ComputedFarmConfigV3,
  defineFarmV3ConfigsFromUniversalFarm,
  fetchUniversalFarms,
  Protocol,
  UniversalFarmConfigV3,
} from '@pancakeswap/farms'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useMemo, useState } from 'react'
import useAllTradingRewardPair, { RewardStatus, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

const useTradingRewardTokenList = () => {
  const { chainId } = useActiveChainId()
  const [farms, setFarms] = useState<ComputedFarmConfigV3[]>([])

  const { data } = useAllTradingRewardPair({
    status: RewardStatus.ALL,
    type: RewardType.CAKE_STAKERS,
  })

  useEffect(() => {
    const fetchFarmV3Config = async () => {
      if (chainId) {
        const farmsV3 = await fetchUniversalFarms(chainId, Protocol.V3)
        setFarms(defineFarmV3ConfigsFromUniversalFarm(farmsV3 as UniversalFarmConfigV3[]))
      }
    }

    fetchFarmV3Config()
  }, [chainId])

  const uniqueAddressList = useMemo(() => {
    const currentTime = Date.now() / 1000

    // eslint-disable-next-line array-callback-return, consistent-return
    const activeRewardCampaignId = data.campaignIds.filter((campaignId) => {
      const incentive = data.campaignIdsIncentive.find((i) => i.campaignId === campaignId)
      if (incentive?.campaignClaimTime && currentTime <= incentive.campaignClaimTime) {
        return campaignId
      }
    })

    const activeCampaignPairs: { [key in string]: Array<string> } = {}
    activeRewardCampaignId.forEach((campaignId) => {
      if (data.campaignPairs[campaignId]) {
        activeCampaignPairs[campaignId] = data.campaignPairs[campaignId][chainId!]
      }
    })

    const tokenAddressArray = Object.values(activeCampaignPairs).reduce((acc, val) => {
      val?.forEach((item) => acc.add(item))
      return acc
    }, new Set())

    return [...tokenAddressArray]
  }, [chainId, data])

  const tokenPairs = useMemo(() => {
    return (
      uniqueAddressList
        // eslint-disable-next-line array-callback-return, consistent-return
        .map((list) => {
          const pair = farms.find((farm) => farm.lpAddress.toLowerCase() === (list as string).toLowerCase())
          if (pair) return pair
        })
        .filter((i) => Boolean(i))
    )
  }, [uniqueAddressList, farms])

  return {
    tokenPairs,
  }
}

export default useTradingRewardTokenList
