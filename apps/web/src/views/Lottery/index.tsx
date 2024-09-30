import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Heading, PageSection, Skeleton } from '@pancakeswap/uikit'
import { LotterySubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { LotteryStatus } from 'config/constants/types'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { styled } from 'styled-components'
import { SubMenu } from 'views/Lottery/components/SubMenu'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import Countdown from './components/Countdown'
import Hero from './components/Hero'
import HistoryTabMenu from './components/HistoryTabMenu'
import HowToPlay from './components/HowToPlay'
import NextDrawCard from './components/NextDrawCard'
import YourHistoryCard from './components/YourHistoryCard'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useShowMoreUserHistory from './hooks/useShowMoreUserRounds'
import useStatusTransitions from './hooks/useStatusTransitions'
import {
  CHECK_PRIZES_BG,
  FINISHED_ROUNDS_BG,
  FINISHED_ROUNDS_BG_DARK,
  GET_TICKETS_BG,
  TITLE_BG,
} from './pageSectionStyles'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const { numUserRoundsRequested, handleShowMoreUserRounds } = useShowMoreUserHistory()

  return (
    <>
      <SubMenu />
      <LotteryPage>
        <PageSection background={TITLE_BG} index={1} hasCurvedDivider={false}>
          <Hero />
        </PageSection>
        <PageSection
          containerProps={{ style: { marginTop: '-30px' } }}
          background={GET_TICKETS_BG}
          concaveDivider
          clipFill={{ light: '#7645D9' }}
          dividerPosition="top"
          index={2}
        >
          <Flex alignItems="center" justifyContent="center" flexDirection="column" pt="24px">
            {status === LotteryStatus.OPEN && (
              <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
                {t('Get your tickets now!')}
              </Heading>
            )}
            <Flex alignItems="center" justifyContent="center" mb="48px">
              {nextEventTime && (postCountdownText || preCountdownText) ? (
                <Countdown
                  nextEventTime={nextEventTime}
                  postCountdownText={postCountdownText}
                  preCountdownText={preCountdownText}
                />
              ) : (
                <Skeleton height="41px" width="250px" />
              )}
            </Flex>
            <NextDrawCard />
          </Flex>
        </PageSection>
        <PageSection background={CHECK_PRIZES_BG} hasCurvedDivider={false} index={2}>
          <CheckPrizesSection />
        </PageSection>
        <PageSection
          position="relative"
          innerProps={{ style: { margin: '0', width: '100%' } }}
          background={isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG}
          hasCurvedDivider={false}
          index={2}
        >
          <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center">
            <Heading mb="24px" scale="xl">
              {t('Finished Rounds')}
            </Heading>
            <Box mb="24px">
              <HistoryTabMenu
                activeIndex={historyTabMenuIndex}
                setActiveIndex={(index) => setHistoryTabMenuIndex(index)}
              />
            </Box>
            {historyTabMenuIndex === 0 ? (
              <AllHistoryCard />
            ) : (
              <YourHistoryCard
                handleShowMoreClick={handleShowMoreUserRounds}
                numUserRoundsRequested={numUserRoundsRequested}
              />
            )}
          </Flex>
        </PageSection>
        <PageSection
          dividerPosition="top"
          dividerFill={{ light: theme.colors.background }}
          clipFill={{ light: '#9A9FD0', dark: '#66578D' }}
          index={2}
        >
          <HowToPlay />
        </PageSection>
        <LotterySubgraphHealthIndicator />
      </LotteryPage>
    </>
  )
}

export default Lottery
