import { useState, useEffect } from 'react'
import { Box, Grid, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { useRankList, MAX_PER_PAGE } from 'views/TradingReward/hooks/useRankList'
import LeaderBoardDesktopView from './DesktopView'
import LeaderBoardMobileView from './MobileView'
import RankingCard from './RankingCard'

interface LeaderboardProps {
  campaignId: string
  incentives: Incentives
}

const Leaderboard: React.FC<React.PropsWithChildren<LeaderboardProps>> = ({ campaignId, incentives }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const { total, topTradersArr, topThreeTraders, isLoading } = useRankList({ campaignId, currentPage })
  const [first, second, third] = topThreeTraders

  useEffect(() => {
    if (total > 0) {
      const max = Math.ceil(total / MAX_PER_PAGE)
      setMaxPages(max)
    }
  }, [total])

  const handleClickPagination = (value: number) => {
    if (!isLoading) {
      setCurrentPage(value)
    }
  }

  return (
    <Box position="relative" style={{ zIndex: 1 }} mt="104px">
      <Box>
        <Text textAlign="center" color="secondary" mb="16px" fontSize={['40px']} bold lineHeight="110%">
          {t('Leaderboard')}
        </Text>
        <Text textAlign="center" bold color="textSubtle">{`${timeFormat(
          locale,
          incentives?.campaignStart,
        )} - ${timeFormat(locale, incentives?.campaignClaimTime)}`}</Text>
        <Text textAlign="center" bold color="textSubtle">
          {t('Top #50 Winners')}
        </Text>
      </Box>
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
      <Box maxWidth={1200} m="auto">
        {isDesktop ? (
          <LeaderBoardDesktopView
            data={topTradersArr}
            maxPage={maxPage}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={handleClickPagination}
          />
        ) : (
          <LeaderBoardMobileView
            data={topTradersArr}
            maxPage={maxPage}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={handleClickPagination}
          />
        )}
      </Box>
    </Box>
  )
}

export default Leaderboard
