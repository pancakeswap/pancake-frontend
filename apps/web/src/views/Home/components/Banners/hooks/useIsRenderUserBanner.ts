import { getLegacyFarmConfig } from '@pancakeswap/farms'
import { legacyFarmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'

const useIsRenderUserBanner = () => {
  const { account, chainId } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const cakePrice = useCakePrice()
  const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(cakePrice).isZero()

  const { data: shouldRenderUserBanner } = useQuery({
    queryKey: ['shouldRenderUserBanner', account],
    queryFn: async () => {
      const v2FarmsConfigSize = (await getLegacyFarmConfig(chainId))?.length || 0
      const v3FarmsConfigSize = legacyFarmsV3ConfigChainMap[chainId]?.length || 0
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
