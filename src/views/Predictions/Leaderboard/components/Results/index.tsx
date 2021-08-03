import React from 'react'
import { Box, Grid, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useGetLeaderboardResults } from 'state/predictions/hooks'
import DesktopResults from './DesktopResults'
import MobileResults from './MobileResults'
import RankingCard from './RankingCard'

const Results = () => {
  const { isXl } = useMatchBreakpoints()
  const [first, second, third, ...rest] = useGetLeaderboardResults()

  return (
    <Box>
      <Grid gridGap={['16px', null, null, '24px']} gridTemplateColumns={['1fr', null, null, 'repeat(3, 1fr)']} p="16px">
        <RankingCard rank={1} user={first} />
        <RankingCard rank={2} user={second} />
        <RankingCard rank={3} user={third} />
      </Grid>
      {isXl ? <DesktopResults results={rest} /> : <MobileResults results={rest} />}
    </Box>
  )
}

export default Results
