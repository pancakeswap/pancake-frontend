import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'
import BigNumber from 'bignumber.js'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { useQuery } from '@tanstack/react-query'

const useIsRenderUserBanner = () => {
  const { account, chainId } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const cakePriceBusd = useCakePrice()
  const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(cakePriceBusd).isZero()

  const { data: shouldRenderUserBanner } = useQuery({
    queryKey: ['shouldRenderUserBanner', account],
    queryFn: async () => {
      const v2FarmsConfigSize = (await getFarmConfig(chainId))?.length || 0
      const v3FarmsConfigSize = farmsV3ConfigChainMap[chainId]?.length || 0
      const totalFarmSize = v2FarmsConfigSize + v3FarmsConfigSize
      return Boolean(totalFarmSize)
    },
    enabled: Boolean(account),
  })

  return useMemo(() => {
    return { shouldRender: Boolean(shouldRenderUserBanner), isEarningsBusdZero }
  }, [isEarningsBusdZero, shouldRenderUserBanner])
}

export default useIsRenderUserBanner
