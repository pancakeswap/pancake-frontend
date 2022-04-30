import { Box, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { LeaderboardDataItem } from '../../../types'
import GridItem from './GridItem'
import ExpandedGridItem from './ExpandedGridItem'
import { LeaderboardStorm, LeaderboardFlippers, LeaderboardCakers } from '../../../svgs'

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
  /* Between 576 - 852px - the expanded wrapper shows as a three-column grid */
  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    grid-auto-flow: column;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }

  /* Above 1080px - it should again show as a three-column grid */
  ${({ theme }) => theme.mediaQueries.xl} {
    display: grid;
  }
`

const TopTradersGrid: React.FC<{ data?: LeaderboardDataItem[]; isExpanded: boolean }> = ({ data, isExpanded }) => {
  const topFive = data && data.slice(0, 5)
  const nextTwenty = data && data.slice(5, 20)
  const teamImages = [<LeaderboardStorm />, <LeaderboardFlippers />, <LeaderboardCakers />]

  return (
    <Box>
      {data ? (
        <>
          {topFive.map((traderData) => {
            return <GridItem key={traderData.address} traderData={traderData} teamImages={teamImages} />
          })}
          {isExpanded && (
            <ExpandedWrapper>
              {nextTwenty.map((traderData) => {
                return <ExpandedGridItem key={traderData.address} traderData={traderData} teamImages={teamImages} />
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
