import React from 'react'
import styled from 'styled-components'
import { Box, Skeleton } from '@pancakeswap-libs/uikit'
import { LeaderboardDataItem } from '../../../types'
import GridItem from './GridItem'

const Grid = styled.div`
  display: grid;
  /* grid-template-columns: repeat(4, 1fr); */
`

const SkeletonLoader = () => {
  return (
    <>
      <Skeleton width="100%" height="76px" mt="4px" />
      <Skeleton width="100%" height="76px" mt="4px" />
      <Skeleton width="100%" height="76px" mt="4px" />
      <Skeleton width="100%" height="76px" mt="4px" />
      <Skeleton width="100%" height="76px" mt="4px" />
    </>
  )
}

const TopTradersGrid: React.FC<{ data?: Array<LeaderboardDataItem> }> = ({ data }) => {
  const topFive = data && data.slice(0, 5)

  return (
    <Box overflowX="hidden">
      {data ? (
        topFive.map((traderData) => {
          return <GridItem traderData={traderData} />
        })
      ) : (
        <SkeletonLoader />
      )}
    </Box>
  )
}

export default TopTradersGrid
