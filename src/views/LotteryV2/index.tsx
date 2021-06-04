import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, TabMenu } from '@pancakeswap/uikit'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/hooks'
import { TITLE_BG, GET_TICKETS_BG, FINISHED_ROUNDS_BG, FINISHED_ROUNDS_BG_DARK } from './pageSectionStyles'
import Hero from './components/Hero'
import DrawInfoCard from './components/DrawInfoCard'
import Countdown from './components/Countdown'
import { getNextLotteryEvent } from './helpers'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'

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
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  useFetchLottery()
  const { currentRound } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)

  return (
    <LotteryPage>
      <PageSection background={TITLE_BG} svgFill={theme.colors.overlay} index={3}>
        <Hero />
      </PageSection>
      <TicketsSection background={GET_TICKETS_BG} hasCurvedDivider={false} index={2}>
        <Flex flexDirection="column">
          <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
            {t('Get your tickets now!')}
          </Heading>
          {/* <Countdown nextEventTimestamp={getNextLotteryEvent(currentRound)} /> */}
          <DrawInfoCard />
        </Flex>
      </TicketsSection>
      <PageSection
        background={isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG}
        hasCurvedDivider={false}
        index={1}
      >
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Heading mb="24px" scale="xl">
            {t('Finished Rounds')}
          </Heading>
          <Box mb="24px">
            <HistoryTabMenu
              activeIndex={historyTabMenuIndex}
              setActiveIndex={(index) => setHistoryTabMenuIndex(index)}
            />
          </Box>
          {historyTabMenuIndex === 0 ? <YourHistoryCard /> : <span>😢</span>}
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
