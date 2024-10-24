import { fetchUniversalFarms, getLegacyFarmConfig, Protocol } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'

const useIsRenderUserBanner = () => {
  const { account, chainId } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()

  const { data: shouldRenderUserBanner = false } = useQuery({
    queryKey: ['shouldRenderUserBanner', account],
    queryFn: async () => {
      const v2FarmsConfigSize = (await getLegacyFarmConfig(chainId))?.length || 0
      const farmsV3 = await fetchUniversalFarms(chainId, Protocol.V3)
      const v3FarmsConfigSize = farmsV3?.length || 0
      const totalFarmSize = v2FarmsConfigSize + v3FarmsConfigSize
      return Boolean(totalFarmSize)
    },
    enabled: Boolean(account),
  })

  const cakePrice = useCakePrice({ enabled: shouldRenderUserBanner })

  return useMemo(() => {
    const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(cakePrice).isZero()
    return { shouldRender: shouldRenderUserBanner, isEarningsBusdZero }
  }, [shouldRenderUserBanner, farmEarningsSum, cakePrice])
}

export default useIsRenderUserBanner
