import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { ChainId } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from 'state/farms'
import { getFarmApr } from 'utils/apr'
import BigNumber from 'bignumber.js'
import { orderBy } from 'lodash'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { Farm } from 'state/types'
import { Skeleton, Flex, SwapVertIcon, IconButton } from '@pancakeswap/uikit'
import TopFarm from './TopFarm'
import RowHeading from './RowHeading'

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
    grid-template-columns: repeat(5, auto);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
  }
`

const FarmsPoolsRow = () => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  const [topFarms, setTopFarms] = useState([null, null, null, null, null])
  const [showFarms, setShowFarms] = useState(true)
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
      setFetchStatus(FetchStatus.FETCHING)
      const activeFarms = nonArchivedFarms.filter((farm) => farm.pid !== 0 && farm.multiplier !== '0X')
      try {
        console.log('fetching')
        await dispatch(fetchFarmsPublicDataAsync(activeFarms.map((farm) => farm.pid)))
        console.log('fetched')
        setFetchStatus(FetchStatus.SUCCESS)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.NOT_FETCHED) {
      fetchFarmData()
      console.log('fetchFarmData')
    }
  }, [dispatch, setFetchStatus, fetchStatus, topFarms, isIntersecting])

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

    if (fetchStatus === FetchStatus.SUCCESS && !topFarms[0]) {
      console.log('getTopFarmsByApr')
      getTopFarmsByApr(farms)
    }
  }, [setTopFarms, farms, fetchStatus, cakePriceBusd, topFarms])

  return (
    <div ref={observerRef}>
      <Flex flexDirection="column" mt="24px">
        <Flex mb="24px">
          <RowHeading text={showFarms ? t('Top Farms') : t('Top Syrup Pools')} />
          <IconButton variant="text" height="100%" width="auto" onClick={() => setShowFarms((prev) => !prev)}>
            <SwapVertIcon height="24px" width="24px" color="textSubtle" />
          </IconButton>
        </Flex>
        <Grid>
          {topFarms.map((topFarm, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TopFarm key={index} farm={topFarm} index={index} visible={showFarms} />
          ))}
        </Grid>
      </Flex>
    </div>
  )
}

export default FarmsPoolsRow
