import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import BigNumber from 'bignumber.js'
import { max, orderBy } from 'lodash'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { Farm } from 'state/types'
import { Skeleton, Flex } from '@pancakeswap/uikit'
import TopFarm from './TopFarm'
import RowHeading from './RowHeading'

const FarmsPoolsRow = () => {
  const [isFetchingFarmData, setIsFetchingFarmData] = useState(true)
  const [topFarms, setTopFarms] = useState(null)
  const { t } = useTranslation()
  const { data: farms } = useFarms()
  const dispatch = useAppDispatch()
  const { observerRef, isIntersecting } = useIntersectionObserver()

  const cakePriceBusdAsString = usePriceCakeBusd().toString()

  const cakePriceBusd = useMemo(() => {
    return new BigNumber(cakePriceBusdAsString)
  }, [cakePriceBusdAsString])

  useEffect(() => {
    const fetchFarmData = async () => {
      const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
      try {
        console.log('fetching')
        await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
        console.log('fetched')
        setIsFetchingFarmData(false)
      } catch (e) {
        console.error(e)
        setIsFetchingFarmData(true)
      }
    }

    if (isIntersecting) {
      fetchFarmData()
    }
  }, [dispatch, setIsFetchingFarmData, isIntersecting])

  useEffect(() => {
    const getTopFarmsByApr = (farmsState: Farm[]) => {
      const farmsWithPrices = farmsState.filter((farm) => farm.lpTotalInQuoteToken && farm.quoteToken.busdPrice)

      const farmsWithApr: FarmWithStakedValue[] = farmsWithPrices.map((farm) => {
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(farm.quoteToken.busdPrice)
        const { cakeRewardsApr, lpRewardsApr } = getFarmApr(
          new BigNumber(farm.poolWeight),
          cakePriceBusd,
          totalLiquidity,
          farm.lpAddresses[ChainId.MAINNET],
        )

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr }
      })

      const sortedByApr = orderBy(farmsWithApr, (farm) => farm.apr + farm.lpRewardsApr, 'desc')
      setTopFarms(sortedByApr.slice(0, 5))
    }

    if (!isFetchingFarmData) {
      console.log('getting em')
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, isFetchingFarmData, cakePriceBusd])

  return (
    <div ref={observerRef}>
      <Flex flexDirection="column">
        <RowHeading text={t('Top Farms')} />
        {topFarms ? (
          topFarms.map((topFarm) => <TopFarm key={topFarm.lpSymbol} farm={topFarm} />)
        ) : (
          <Skeleton width={120} height={20} />
        )}
      </Flex>
    </div>
  )
}

export default FarmsPoolsRow
