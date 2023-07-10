import { useState, useEffect, useMemo, useCallback } from 'react'
import { Box, Grid, Text, useMatchBreakpoints, PaginationButton, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { useRankList, MAX_PER_PAGE } from 'views/TradingReward/hooks/useRankList'
import LeaderBoardDesktopView from './DesktopView'
import LeaderBoardMobileView from './MobileView'
import RankingCard from './RankingCard'
import MyRank from './MyRank'

interface LeaderboardProps {
  campaignIdsIncentive: Incentives[]
}

const MAX_CAMPAIGN_PER_PAGE = 1

const Leaderboard: React.FC<React.PropsWithChildren<LeaderboardProps>> = ({ campaignIdsIncentive }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const [index, setIndex] = useState(0)
  const [campaignPage, setCampaignPage] = useState(1)
  const [campaignMaxPage, setCampaignMaxPages] = useState(1)
  const [campaignLeaderBoardList, setCampaignLeaderBoardList] = useState({
    campaignId: '0',
    campaignStart: 0,
    campaignClaimTime: 0,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const { total, topTradersArr, topThreeTraders, isLoading } = useRankList({
    campaignId: campaignLeaderBoardList.campaignId,
    currentPage,
  })
  const [first, second, third] = topThreeTraders

  const allLeaderBoard = useMemo(
    () =>
      campaignIdsIncentive
        .map((i) => ({
          campaignId: i.campaignId,
          campaignStart: i.campaignStart,
          campaignClaimTime: i.campaignClaimTime,
        }))
        .sort((a, b) => Number(b.campaignId) - Number(a.campaignId)),
    [campaignIdsIncentive],
  )
  const currentLeaderBoard = useMemo(
    () => allLeaderBoard.find((i) => i.campaignClaimTime >= Date.now() / 1000),
    [allLeaderBoard],
  )

  const round = useMemo(() => campaignMaxPage - (campaignPage - 1), [campaignMaxPage, campaignPage])

  const sliceAllLeaderBoard = useCallback(() => {
    const slice = allLeaderBoard.slice(MAX_CAMPAIGN_PER_PAGE * (campaignPage - 1), MAX_CAMPAIGN_PER_PAGE * campaignPage)
    setCampaignLeaderBoardList({ ...slice[0] })
  }, [allLeaderBoard, campaignPage])

  useEffect(() => {
    if (allLeaderBoard.length > 0) {
      const max = Math.ceil(allLeaderBoard?.length / MAX_CAMPAIGN_PER_PAGE)
      setCampaignMaxPages(max)
    }

    return () => {
      setCampaignPage(1)
      setCampaignMaxPages(1)
    }
  }, [allLeaderBoard.length])

  useEffect(() => {
    const getActivitySlice = () => {
      setCurrentPage(1)

      if (currentLeaderBoard?.campaignId) {
        if (index === 0) {
          setCampaignPage(1)
          setCampaignLeaderBoardList(currentLeaderBoard)
        } else {
          setCampaignPage(2)
          sliceAllLeaderBoard()
        }
      } else {
        setIndex(1)
        sliceAllLeaderBoard()
      }
    }

    if (allLeaderBoard.length > 0) {
      getActivitySlice()
    }
  }, [index, allLeaderBoard, currentLeaderBoard, sliceAllLeaderBoard, campaignMaxPage])

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
    <Box id="leaderboard" position="relative" style={{ zIndex: 1 }} mt="104px">
      <Box>
        <Text textAlign="center" color="secondary" mb="16px" fontSize={['40px']} bold lineHeight="110%">
          {t('Leaderboard')}
        </Text>
        {currentLeaderBoard && (
          <Box width="350px" margin="auto auto 16px auto">
            <ButtonMenu activeIndex={index} onItemClick={setIndex} fullWidth scale="sm" variant="subtle">
              <ButtonMenuItem>{t('Current Round')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Previous Rounds')}</ButtonMenuItem>
            </ButtonMenu>
          </Box>
        )}
        {round > 0 && (
          <>
            <Text textAlign="center" color="textSubtle" bold>
              {t('Round #%round%  |  %startTime% - %endTime%', {
                round,
                startTime: timeFormat(locale, campaignLeaderBoardList?.campaignStart),
                endTime: timeFormat(locale, campaignLeaderBoardList?.campaignClaimTime),
              })}
            </Text>
            {index === 1 && (
              <PaginationButton
                showMaxPageText
                currentPage={campaignPage}
                maxPage={campaignMaxPage}
                setCurrentPage={setCampaignPage}
              />
            )}
          </>
        )}
        {campaignLeaderBoardList.campaignStart > 0 && (
          <Container mb="16px">
            <Grid
              gridGap={['16px', null, null, null, null, '24px']}
              gridTemplateColumns={['1fr', null, null, null, null, 'repeat(3, 1fr)']}
            >
              {(topTradersArr?.length > 0 || isLoading) && (
                <>
                  <RankingCard rank={1} user={first} />
                  <RankingCard rank={2} user={second} />
                  <RankingCard rank={3} user={third} />
                </>
              )}
            </Grid>
          </Container>
        )}
        <Box maxWidth={1200} m="auto">
          <MyRank campaignId={campaignLeaderBoardList.campaignId} />
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
    </Box>
  )
}

export default Leaderboard
