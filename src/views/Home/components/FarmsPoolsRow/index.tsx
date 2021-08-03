import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useGetTopFarmsByApr from 'views/Home/hooks/useGetTopFarmsByApr'
import { Flex, SwapVertIcon, IconButton } from '@pancakeswap/uikit'
import TopFarm from './TopFarm'
import RowHeading from './RowHeading'

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
  const [showFarms, setShowFarms] = useState(true)
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const { topFarms } = useGetTopFarmsByApr(isIntersecting)

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
