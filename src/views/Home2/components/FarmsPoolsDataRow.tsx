import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { useFarms, usePriceCakeBusd } from 'state/farms/hooks'
import { Flex, Text, Heading, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useAppDispatch } from 'state'
import { fetchFarmsPublicDataAsync, nonArchivedFarms } from 'state/farms'

const StyledColumn = styled(Flex)`
  flex-direction: column;
  padding: 0 16px;
  border-left: 1px ${({ theme }) => theme.colors.inputSecondary} solid;
`

const FarmsPoolsDataRow = () => {
  const [isFetchingFarmData, setIsFetchingFarmData] = useState(true)
  const { t } = useTranslation()
  const { data: farmsLP } = useFarms()
  const cakePrice = usePriceCakeBusd()
  const dispatch = useAppDispatch()
  const { observerRef, isIntersecting } = useIntersectionObserver()

  // Fetch farm data once to get the max APR
  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        await dispatch(fetchFarmsPublicDataAsync(nonArchivedFarms.map((nonArchivedFarm) => nonArchivedFarm.pid)))
      } finally {
        setIsFetchingFarmData(false)
      }
    }

    if (isIntersecting) {
      fetchFarmData()
    }
  }, [dispatch, setIsFetchingFarmData, isIntersecting])

  return (
    <Flex mt="24px" justifyContent="space-between">
      sss
    </Flex>
  )
}

export default FarmsPoolsDataRow
