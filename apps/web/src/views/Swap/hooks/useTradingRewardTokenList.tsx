import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import useAllTradingRewardPair, { RewardStatus } from 'views/TradingReward/hooks/useAllTradingRewardPair'

const useTradingRewardTokenList = () => {
  const farms = farmsV3ConfigChainMap[ChainId.BSC]
  const { data } = useAllTradingRewardPair(RewardStatus.ALL)

  const uniqueAddressList = useMemo(() => {
    const tokenAddressArray = Object.values(data.campaignPairs).reduce((acc, val) => {
      val.forEach((item) => acc.add(item))
      return acc
    }, new Set())

    return [...tokenAddressArray]
  }, [data])

  const tokenPairs = useMemo(
    () => farms.filter((farm) => uniqueAddressList.includes(farm.lpAddress.toLowerCase())),
    [uniqueAddressList, farms],
  )

  return tokenPairs
}

export default useTradingRewardTokenList
