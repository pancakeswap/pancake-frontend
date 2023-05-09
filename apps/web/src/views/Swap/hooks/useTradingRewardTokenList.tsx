import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import useAllTradingRewardPair, { RewardStatus } from 'views/TradingReward/hooks/useAllTradingRewardPair'

const useTradingRewardTokenList = () => {
  const farms = farmsV3ConfigChainMap[ChainId.BSC]
  const { data } = useAllTradingRewardPair(RewardStatus.ALL)
  const currentTime = new Date().getTime() / 1000

  const uniqueAddressList = useMemo(() => {
    // eslint-disable-next-line array-callback-return, consistent-return
    const activeRewardCampaignId = data.campaignIds.filter((campaignId) => {
      const incentive = data.campaignIdsIncentive.find((i) => i.campaignId === campaignId)
      if (incentive.campaignClaimTime > currentTime) {
        return campaignId
      }
    })

    const activeCampaignPairs: { [key in string]: Array<string> } = {}
    activeRewardCampaignId.forEach((campaignId) => {
      if (data.campaignPairs[campaignId]) {
        activeCampaignPairs[campaignId] = data.campaignPairs[campaignId]
      }
    })

    const tokenAddressArray = Object.values(activeCampaignPairs).reduce((acc, val) => {
      val.forEach((item) => acc.add(item))
      return acc
    }, new Set())

    return [...tokenAddressArray]
  }, [data, currentTime])

  const tokenPairs = useMemo(
    () => farms.filter((farm) => uniqueAddressList.includes(farm.lpAddress.toLowerCase())),
    [uniqueAddressList, farms],
  )

  return {
    tokenPairs,
    campaignId: data.campaignIds[0],
  }
}

export default useTradingRewardTokenList
