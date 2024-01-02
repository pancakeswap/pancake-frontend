import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { AutoRenewIcon, Box, Button, Flex, Grid, useMatchBreakpoints } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { FetchStatus } from 'config/constants/types'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { filterNextPageLeaderboard } from 'state/predictions'
import { LEADERBOARD_RESULTS_PER_PAGE } from 'state/predictions/helpers'
import {
  useGetLeaderboardHasMoreResults,
  useGetLeaderboardLoadingState,
  useGetLeaderboardResults,
  useGetLeaderboardSkip,
} from 'state/predictions/hooks'
import DesktopResults from './DesktopResults'
import MobileResults from './MobileResults'
import RankingCard from './RankingCard'

interface ResultsProps {
  token: Token | undefined
  api: string
}

const Results: React.FC<React.PropsWithChildren<ResultsProps>> = ({ token, api }) => {
  const { isDesktop } = useMatchBreakpoints()
  const { t } = useTranslation()
  const [first, second, third, ...rest] = useGetLeaderboardResults()
  const leaderboardLoadingState = useGetLeaderboardLoadingState()
  const isLoading = leaderboardLoadingState === FetchStatus.Fetching
  const currentSkip = useGetLeaderboardSkip()
  const hasMoreResults = useGetLeaderboardHasMoreResults()
  const dispatch = useLocalDispatch()

  const handleClick = () => {
    if (api && token?.symbol && token?.chainId) {
      dispatch(
        filterNextPageLeaderboard({
          api,
          skip: currentSkip + LEADERBOARD_RESULTS_PER_PAGE,
          tokenSymbol: token.symbol,
          chainId: token.chainId,
        }),
      )
    }
  }

  return (
    <Box position="relative" style={{ zIndex: 1 }}>
      <Container mb="16px">
        <Grid
          gridGap={['16px', null, null, null, null, '24px']}
          gridTemplateColumns={['1fr', null, null, null, null, 'repeat(3, 1fr)']}
        >
          {first && <RankingCard rank={1} user={first} token={token} api={api} />}
          {second && <RankingCard rank={2} user={second} token={token} api={api} />}
          {third && <RankingCard rank={3} user={third} token={token} api={api} />}
        </Grid>
      </Container>
      {isDesktop ? (
        <DesktopResults results={rest} token={token} api={api} />
      ) : (
        <MobileResults results={rest} token={token} api={api} />
      )}
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
