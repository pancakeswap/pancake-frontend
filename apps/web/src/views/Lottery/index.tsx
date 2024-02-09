import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Heading, PageSection, Skeleton } from '@pancakeswap/uikit'
import { LotterySubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import { LotteryStatus } from 'config/constants/types'
import useTheme from 'hooks/useTheme'
import throttle from 'lodash/throttle'
import { useEffect, useRef, useState } from 'react'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import { styled } from 'styled-components'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import { CnyBanner } from './components/CnyBanner/CnyBanner'
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
  CNY_BANNER_BG,
  CNY_TITLE_BG,
  FINISHED_ROUNDS_BG,
  FINISHED_ROUNDS_BG_DARK,
  GET_TICKETS_BG,
} from './pageSectionStyles'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const StyledImage = styled.img`
  position: absolute; /* or absolute depending on your preference */
  z-index: 1; /* Adjust this value to ensure the image appears above other content */
  top: -15px; /* Adjust top position as needed */
  left: calc(50% - 75px - 180px);
  ${({ theme }) => theme.mediaQueries.lg} {
    left: calc(50% - 75px - 240px); // calc(50% - 75px) is absolute center alignment
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    right: 0;
  }
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
  const [hideImage, setHideImage] = useState(true)
  const refPrevOffset = useRef(typeof window === 'undefined' ? 0 : window.pageYOffset)

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset
      const isTopOfPage = currentOffset === 0
      if (isTopOfPage) setHideImage(true)
      if (!isTopOfPage) setHideImage(false)
      refPrevOffset.current = currentOffset
    }
    const throttledHandleScroll = throttle(handleScroll, 200)

    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  return (
    <>
      <LotteryPage>
        <Flex width="100%" height="125px" background={CNY_BANNER_BG} alignItems="center" justifyContent="center">
          <CnyBanner />
          {!hideImage && <StyledImage src="/images/lottery/cny-bunny.png" alt="" height={159} width={149} />}
        </Flex>
        <PageSection background={CNY_TITLE_BG} index={1} hasCurvedDivider={false}>
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
