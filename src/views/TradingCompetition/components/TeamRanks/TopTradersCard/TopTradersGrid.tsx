import React from 'react'
import { Box, Skeleton } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import GridItem from './GridItem'
import ExpandedGridItem from './ExpandedGridItem'

const SkeletonLoader = () => {
  return (
    <Box width="100%">
      <Skeleton width="100%" height="76px" m="3px" />
      <Skeleton width="100%" height="76px" m="3px" />
      <Skeleton width="100%" height="76px" m="3px" />
      <Skeleton width="100%" height="76px" m="3px" />
      <Skeleton width="100%" height="76px" m="3px" />
    </Box>
  )
}

const ExpandedWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-auto-flow: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const TopTradersGrid: React.FC<{ data?: LeaderboardDataItem[]; isExpanded: boolean }> = ({ data, isExpanded }) => {
  const topFive = data && data.slice(0, 5)
  const nextTwenty = data && data.slice(5, 20)

  return (
    <Box>
      {data ? (
        <>
          {topFive.map((traderData) => {
            return <GridItem key={traderData.address} traderData={traderData} />
          })}
          {isExpanded && (
            <ExpandedWrapper>
              {nextTwenty.map((traderData) => {
                return <ExpandedGridItem key={traderData.address} traderData={traderData} />
              })}
            </ExpandedWrapper>
          )}
        </>
      ) : (
        <SkeletonLoader />
      )}
    </Box>
  )
}

export default TopTradersGrid
