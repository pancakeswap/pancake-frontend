import React from 'react'
import { Box, Skeleton } from '@pancakeswap-libs/uikit'
import { LeaderboardDataItem } from '../../../types'
import GridItem from './GridItem'

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

const TopTradersGrid: React.FC<{ data?: Array<LeaderboardDataItem> }> = ({ data }) => {
  const topFive = data && data.slice(0, 5)

  return (
    <Box>
      {data ? (
        topFive.map((traderData) => {
          return <GridItem key={traderData.address} traderData={traderData} />
        })
      ) : (
        <SkeletonLoader />
      )}
    </Box>
  )
}

export default TopTradersGrid
