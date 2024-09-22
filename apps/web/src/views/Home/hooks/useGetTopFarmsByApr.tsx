import { getLegacyFarmConfig } from '@pancakeswap/farms'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import orderBy from 'lodash/orderBy'
import { fetchV3FarmsAvgInfo } from 'queries/farms'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import { useFarms } from 'state/farms/hooks'
import { useFarmsV3 } from 'state/farmsV3/hooks'
import { getFarmApr } from 'utils/apr'

const useGetTopFarmsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()
  const { data: farms, regularCakePerBlock } = useFarms()
  const { data: farmsV3, isLoading } = useFarmsV3()
  const [topFarms, setTopFarms] = useState<
    ({
      lpSymbol: string
      apr: number | null
      lpRewardsApr: number
      version: 2 | 3
    } | null)[]
  >(() => [null, null, null, null, null])
  const cakePrice = useCakePrice()
  const { chainId } = useActiveChainId()

  const { status: fetchStatus, isFetching } = useQuery({
    queryKey: [chainId, 'fetchTopFarmsByApr'],

    queryFn: async () => {
      if (!chainId) return undefined
      const farmsConfig = await getLegacyFarmConfig(chainId)
      const activeFarms = farmsConfig?.filter((farm) => farm.pid !== 0)
      return dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms?.map((farm) => farm.pid) ?? [], chainId }))
    },

    enabled: Boolean(isIntersecting && chainId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  const { data: farmsV3Aprs } = useQuery({
    queryKey: [chainId, 'farmsV3Apr'],

    queryFn: async () => {
      if (!chainId) return undefined
      const farmAvgInfo = await fetchV3FarmsAvgInfo(chainId)
      return Object.keys(farmAvgInfo).reduce((acc, key) => {
        const tokenData = farmAvgInfo[key]
        // eslint-disable-next-line no-param-reassign
        acc[key] = parseFloat(tokenData.apr7d.toFixed(2))
        return acc
      }, {} as Record<string, number>)
    },

    enabled: Boolean(isIntersecting && chainId),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (fetchStatus === 'success' && farms?.length > 0 && !isLoading) {
      const farmsWithPrices = farms.filter(
        (farm) =>
          farm.lpTotalInQuoteToken &&
          farm.quoteTokenPriceBusd &&
          farm.pid !== 0 &&
          farm.multiplier &&
          farm.multiplier !== '0X',
      )
      const farmsWithApr = farmsWithPrices.map((farm) => {
        const totalLiquidity = farm?.quoteTokenPriceBusd
          ? farm?.lpTotalInQuoteToken?.times(farm.quoteTokenPriceBusd)
          : undefined
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          chainId,
          farm.poolWeight,
          cakePrice,
          totalLiquidity,
          farm.lpAddress,
          regularCakePerBlock,
          farm.lpRewardsApr,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, version: 2 as const }
      })

      const activeFarmV3 = farmsV3.farmsWithPrice
        .filter((f) => f.multiplier !== '0X' && 'cakeApr' in f)
        .map((f) => ({
          ...f,
          apr: f.cakeApr ? +f.cakeApr : Number.NaN,
          lpRewardsApr: farmsV3Aprs?.[f.lpAddress] ?? 0,
          version: 3 as const,
        }))

      const sortedByApr = orderBy(
        [...farmsWithApr, ...activeFarmV3],
        (farm) => (farm.apr !== null ? farm.apr + farm.lpRewardsApr : farm.lpRewardsApr),
        'desc',
      )
      setTopFarms(sortedByApr.slice(0, 5))
    }
  }, [cakePrice, chainId, farms, farmsV3.farmsWithPrice, fetchStatus, isLoading, regularCakePerBlock, farmsV3Aprs])
  return { topFarms, fetched: fetchStatus === 'success' && !isFetching, chainId }
}

export default useGetTopFarmsByApr
