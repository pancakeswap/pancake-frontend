import { Box, Button, Grid, Flex, AutoRenewIcon, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import {
  useGetLeaderboardHasMoreResults,
  useGetLeaderboardLoadingState,
  useGetLeaderboardResults,
  useGetLeaderboardSkip,
} from 'state/predictions/hooks'
import { filterNextPageLeaderboard } from 'state/predictions'
import { LEADERBOARD_RESULTS_PER_PAGE } from 'state/predictions/helpers'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { FetchStatus } from 'config/constants/types'
import DesktopResults from './DesktopResults'
import MobileResults from './MobileResults'
import RankingCard from './RankingCard'

const Results = () => {
  const { isDesktop } = useMatchBreakpointsContext()
  const { t } = useTranslation()
  const [first, second, third, ...rest] = useGetLeaderboardResults()
  const leaderboardLoadingState = useGetLeaderboardLoadingState()
  const isLoading = leaderboardLoadingState === FetchStatus.Fetching
  const currentSkip = useGetLeaderboardSkip()
  const hasMoreResults = useGetLeaderboardHasMoreResults()
  const dispatch = useLocalDispatch()

  const handleClick = () => {
    dispatch(filterNextPageLeaderboard(currentSkip + LEADERBOARD_RESULTS_PER_PAGE))
  }

  return (
    <Box>
      <Container mb="16px">
        <Grid
          gridGap={['16px', null, null, null, null, '24px']}
          gridTemplateColumns={['1fr', null, null, null, null, 'repeat(3, 1fr)']}
        >
          {first && <RankingCard rank={1} user={first} />}
          {second && <RankingCard rank={2} user={second} />}
          {third && <RankingCard rank={3} user={third} />}
        </Grid>
      </Container>
      {isDesktop ? <DesktopResults results={rest} /> : <MobileResults results={rest} />}
      <Flex mb="40px" justifyContent="center">
        {hasMoreResults && (
          <Button
            variant="secondary"
            isLoading={isLoading}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            onClick={handleClick}
          >
            {isLoading ? t('Loading...') : t('View More')}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default Results
