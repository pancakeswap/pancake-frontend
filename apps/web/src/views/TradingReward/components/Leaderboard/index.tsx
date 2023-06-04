import { useState } from 'react'
import { Box, Grid, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import DesktopView from './DesktopView'
import MobileView from './MobileView'
import RankingCard from './RankingCard'

interface LeaderboardProps {
  incentives: Incentives
}

const Leaderboard: React.FC<React.PropsWithChildren<LeaderboardProps>> = ({ incentives }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  // const [first, second, third, ...rest] = useGetLeaderboardResults()

  return (
    <Box position="relative" style={{ zIndex: 1 }} mt="104px">
      <Box mb={['73px']}>
        <Text textAlign="center" color="secondary" mb="16px" fontSize={['64px']} bold lineHeight="110%">
          {t('Leaderboard')}
        </Text>
        <Text textAlign="center" bold color="textSubtle">{`${timeFormat(
          locale,
          incentives?.campaignStart,
        )} - ${timeFormat(locale, incentives?.campaignClaimTime)}`}</Text>
        <Text textAlign="center" bold color="textSubtle">
          {t('Top #500 Winners')}
        </Text>
      </Box>
      <Container mb="16px">
        <Grid
          gridGap={['16px', null, null, null, null, '24px']}
          gridTemplateColumns={['1fr', null, null, null, null, 'repeat(3, 1fr)']}
        >
          <RankingCard rank={1} />
          <RankingCard rank={2} />
          <RankingCard rank={3} />
        </Grid>
      </Container>
      <Box maxWidth={1200} m="auto">
        {isDesktop ? (
          <DesktopView currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
        ) : (
          <MobileView currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
        )}
      </Box>
    </Box>
  )
}

export default Leaderboard
