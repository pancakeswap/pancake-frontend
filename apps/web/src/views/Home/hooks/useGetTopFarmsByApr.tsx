import { useState, useEffect } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useCakePrice } from 'hooks/useCakePrice'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import orderBy from 'lodash/orderBy'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useFarmsV3 } from 'state/farmsV3/hooks'
import { useQuery } from '@tanstack/react-query'

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
  const cakePriceBusd = useCakePrice()
  const { chainId } = useActiveChainId()

  const { status: fetchStatus, isFetching } = useQuery({
    queryKey: [chainId, 'fetchTopFarmsByApr'],

    queryFn: async () => {
      if (!chainId) return undefined
      const farmsConfig = await getFarmConfig(chainId)
      const activeFarms = farmsConfig?.filter((farm) => farm.pid !== 0)
      return dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms?.map((farm) => farm.pid) ?? [], chainId }))
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
          cakePriceBusd,
          totalLiquidity,
          farm.lpAddress,
          regularCakePerBlock,
        )
        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, version: 2 as const }
      })

      const activeFarmV3 = farmsV3.farmsWithPrice
        .filter((f) => f.multiplier !== '0X' && 'cakeApr' in f)
        .map((f) => ({
          ...f,
          apr: f.cakeApr ? +f.cakeApr : Number.NaN,
          // lpRewardsApr missing
          lpRewardsApr: 0,
          version: 3 as const,
        }))

      const sortedByApr = orderBy(
        [...farmsWithApr, ...activeFarmV3],
        (farm) => (farm.apr !== null ? farm.apr + farm.lpRewardsApr : farm.lpRewardsApr),
        'desc',
      )
      setTopFarms(sortedByApr.slice(0, 5))
    }
  }, [cakePriceBusd, chainId, farms, farmsV3.farmsWithPrice, fetchStatus, isLoading, regularCakePerBlock])
  return { topFarms, fetched: fetchStatus === 'success' && !isFetching, chainId }
}

export default useGetTopFarmsByApr
