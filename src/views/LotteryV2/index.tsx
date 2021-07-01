import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/hooks'
import {
  TITLE_BG,
  GET_TICKETS_BG,
  FINISHED_ROUNDS_BG,
  FINISHED_ROUNDS_BG_DARK,
  CHECK_PRIZES_BG,
} from './pageSectionStyles'
import useNextEventCountdown from './hooks/useNextEventCountdown'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import NextDrawCard from './components/NextDrawCard'
import Countdown from './components/Countdown'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizes from './components/CheckPrizes'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const TicketsSection = styled(PageSection)`
  margin-top: -32px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: -64px;
  }
`

const LotteryV2 = () => {
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
  const secondsRemaining = useNextEventCountdown(nextEventTime)

  return (
    <LotteryPage>
      <PageSection background={TITLE_BG} svgFill={theme.colors.overlay} index={4}>
        <Hero />
      </PageSection>
      <TicketsSection background={GET_TICKETS_BG} hasCurvedDivider={false} index={3}>
        <Flex flexDirection="column">
          {status === LotteryStatus.OPEN && (
            <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
              {t('Get your tickets now!')}
            </Heading>
          )}
          <Flex alignItems="center" justifyContent="center" mb="48px">
            {secondsRemaining && (postCountdownText || preCountdownText) ? (
              <Countdown
                secondsRemaining={secondsRemaining}
                postCountdownText={postCountdownText}
                preCountdownText={preCountdownText}
              />
            ) : (
              <Skeleton height="41px" width="250px" />
            )}
          </Flex>
          <NextDrawCard />
        </Flex>
      </TicketsSection>
      <PageSection background={CHECK_PRIZES_BG} hasCurvedDivider={false} index={2}>
        <CheckPrizes />
      </PageSection>
      <PageSection
        background={isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG}
        hasCurvedDivider={false}
        index={1}
        containerProps={{ style: { margin: '0' } }}
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
          {historyTabMenuIndex === 0 ? <YourHistoryCard /> : <AllHistoryCard />}
        </Flex>
      </PageSection>

      <PageSection hasCurvedDivider={false} index={0}>
        <Flex>
          <img src="/images/lottery/tombola.png" alt="tombola bunny" height="auto" width="240px" />
        </Flex>
      </PageSection>
    </LotteryPage>
  )
}

export default LotteryV2
