import React from 'react'
import { Box, Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useGetLeaderboardResults } from 'state/predictions/hooks'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import DesktopResults from './DesktopResults'
import MobileResults from './MobileResults'
import RankingCard from './RankingCard'

const Results = () => {
  const { isXl } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [first, second, third, ...rest] = useGetLeaderboardResults()

  return (
    <Box>
      <Container mb="16px">
        <Heading as="h2" scale="md" color="secondary" mb="16px">
          {t('All Others')}
        </Heading>
        <Grid gridGap={['16px', null, null, '24px']} gridTemplateColumns={['1fr', null, null, 'repeat(3, 1fr)']}>
          <RankingCard rank={1} user={first} />
          <RankingCard rank={2} user={second} />
          <RankingCard rank={3} user={third} />
        </Grid>
      </Container>
      {isXl ? <DesktopResults results={rest} /> : <MobileResults results={rest} />}
    </Box>
  )
}

export default Results
