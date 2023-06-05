import { useState, useEffect } from 'react'
import { Box, Grid, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { useRankList, MAX_PER_PAGE, RankListDetail } from 'views/TradingReward/hooks/useRankList'
import DesktopView from './DesktopView'
import MobileView from './MobileView'
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
  const { total, topTradersArr, isLoading } = useRankList({ campaignId, currentPage })
  const [first, second, third] = topTradersArr
  const [rankList, setRankList] = useState<RankListDetail[]>([])

  useEffect(() => {
    if (total > 0) {
      const max = Math.ceil(total / MAX_PER_PAGE)
      setMaxPages(max)
    }

    return () => {
      setMaxPages(1)
      setCurrentPage(1)
      setRankList([])
    }
  }, [total])

  useEffect(() => {
    const plusNumber = currentPage === 1 ? 3 : 0
    const getActivitySlice = () => {
      const slice = topTradersArr.slice(MAX_PER_PAGE * (currentPage - 1) + plusNumber, MAX_PER_PAGE * currentPage)
      setRankList(slice)
    }

    if (topTradersArr.length > 0) {
      getActivitySlice()
    }
  }, [topTradersArr, currentPage, total])

  return (
    <Box position="relative" style={{ zIndex: 1 }} mt="104px">
      <Box>
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
          {first && <RankingCard rank={1} user={first} />}
          {second && <RankingCard rank={2} user={second} />}
          {third && <RankingCard rank={3} user={third} />}
        </Grid>
      </Container>
      <Box maxWidth={1200} m="auto">
        {isDesktop ? (
          <DesktopView
            data={rankList}
            maxPage={maxPage}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <MobileView
            data={rankList}
            maxPage={maxPage}
            isLoading={isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Box>
    </Box>
  )
}

export default Leaderboard
