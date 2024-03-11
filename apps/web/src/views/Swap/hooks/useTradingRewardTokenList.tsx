import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'

const useTradingRewardTokenList = () => {
  const { chainId } = useActiveChainId()

  const uniqueAddressList = useMemo(() => {
    const currentTime = Date.now() / 1000

    // eslint-disable-next-line array-callback-return, consistent-return

    const activeCampaignPairs: { [key in string]: Array<string> } = {}

    const tokenAddressArray = Object.values(activeCampaignPairs).reduce((acc, val) => {
      val?.forEach((item) => acc.add(item))
      return acc
    }, new Set())

    return [...tokenAddressArray]
  }, [chainId])

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
