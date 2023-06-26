import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import useAllTradingRewardPair, { RewardStatus, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'

const useTradingRewardTokenList = () => {
  const { chainId } = useActiveChainId()
  const { data } = useAllTradingRewardPair({
    status: RewardStatus.ALL,
    type: RewardType.CAKE_STAKERS,
  })

  const uniqueAddressList = useMemo(() => {
    const currentTime = Date.now() / 1000

    // eslint-disable-next-line array-callback-return, consistent-return
    const activeRewardCampaignId = data.campaignIds.filter((campaignId) => {
      const incentive = data.campaignIdsIncentive.find((i) => i.campaignId === campaignId)
      if (currentTime <= incentive.campaignClaimTime) {
        return campaignId
      }
    })

    const activeCampaignPairs: { [key in string]: Array<string> } = {}
    activeRewardCampaignId.forEach((campaignId) => {
      if (data.campaignPairs[campaignId]) {
        activeCampaignPairs[campaignId] = data.campaignPairs[campaignId][chainId]
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
          const farms = farmsV3ConfigChainMap[chainId as ChainId]
          const pair = farms.find((farm) => farm.lpAddress.toLowerCase() === (list as string).toLowerCase())
          if (pair) return pair
        })
        .filter((i) => Boolean(i))
    )
  }, [uniqueAddressList, chainId])

  return {
    tokenPairs,
  }
}

export default useTradingRewardTokenList
