import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Skeleton, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { LotteryStatus } from 'config/constants/types'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useNextEventCountdown from 'hooks/lottery/v2/useNextEventCountdown'
import useGetNextLotteryEvent from 'hooks/lottery/v2/useGetNextLotteryEvent'
import { useAppDispatch } from 'state'
import { useFetchLottery, useGetPastLotteries, useGetUserLotteryData, useLottery } from 'state/hooks'
import { fetchCurrentLottery, fetchPastLotteries, fetchPublicLotteryData, fetchUserLotteries } from 'state/lottery'
import fetchUnclaimedUserRewards from 'state/lottery/fetchUnclaimedUserRewards'
import { TITLE_BG, GET_TICKETS_BG, FINISHED_ROUNDS_BG, FINISHED_ROUNDS_BG_DARK } from './pageSectionStyles'
import Hero from './components/Hero'
import DrawInfoCard from './components/DrawInfoCard'
import Countdown from './components/Countdown'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import ClaimPrizesModal from './components/ClaimPrizesModal'
import PrizeCollectionCard from './components/PrizeCollectionCard'

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
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isDark, theme } = useTheme()
  const {
    currentLotteryId,
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)
  const secondsRemaining = useNextEventCountdown(nextEventTime)
  const userLotteryData = useGetUserLotteryData()
  const pastLotteries = useGetPastLotteries()
  const [unclaimedRewards, setUnclaimedRewards] = useState({ isFetchingRewards: true, rewards: [] })
  const [hasPoppedClaimModal, setHasPoppedClaimModal] = useState(false)
  const [onPresentClaimModal] = useModal(<ClaimPrizesModal roundsToClaim={unclaimedRewards.rewards} />)

  const fetchRewards = useCallback(async () => {
    console.log('fetching rewards')
    const unclaimedRewardsResponse = await fetchUnclaimedUserRewards(
      account,
      currentLotteryId,
      userLotteryData,
      pastLotteries,
    )
    setUnclaimedRewards({ isFetchingRewards: false, rewards: unclaimedRewardsResponse })
  }, [account, userLotteryData, currentLotteryId, pastLotteries])

  useEffect(() => {
    // Check if user has rewards on page load and account change
    if (userLotteryData && account && currentLotteryId && pastLotteries) {
      fetchRewards()
    }
  }, [account, userLotteryData, currentLotteryId, pastLotteries, setUnclaimedRewards, fetchRewards])

  useEffect(() => {
    // Manage showing unclaimed rewards modal once per visit
    if (unclaimedRewards.rewards.length > 0 && !hasPoppedClaimModal) {
      setHasPoppedClaimModal(true)
      onPresentClaimModal()
    }
  }, [unclaimedRewards, hasPoppedClaimModal, onPresentClaimModal])

  // Data fetches for lottery phase transitions
  useEffect(() => {
    // Current lottery transitions from open > closed, or closed > claimable
    if (status === LotteryStatus.OPEN && secondsRemaining === 0) {
      dispatch(fetchCurrentLottery({ currentLotteryId }))
      console.log('fetching current lottery')
    }
    // Current lottery transitions from closed > claimable
    if (status === LotteryStatus.CLOSE && secondsRemaining === 0) {
      dispatch(fetchCurrentLottery({ currentLotteryId }))
      fetchRewards()
      console.log('fetching current lottery & user rewards')
    }

    // Next lottery starting
    if (status === LotteryStatus.CLAIMABLE && secondsRemaining === 0) {
      // Get new 'currentLotteryId' from SC
      dispatch(fetchPublicLotteryData())
      // Update lottery history
      dispatch(fetchPastLotteries())
      console.log('updating currentLotteryId')
    }
  }, [secondsRemaining, currentLotteryId, status, fetchRewards, dispatch])

  console.log('status~', status)

  return (
    <LotteryPage>
      <PageSection background={TITLE_BG} svgFill={theme.colors.overlay} index={3}>
        <Hero />
      </PageSection>
      <TicketsSection background={GET_TICKETS_BG} hasCurvedDivider={false} index={2}>
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
          <PrizeCollectionCard
            unclaimedRewards={unclaimedRewards}
            onSuccess={() => {
              setUnclaimedRewards({ isFetchingRewards: false, rewards: [] })
              dispatch(fetchUserLotteries({ account }))
            }}
            fetchRewards={fetchRewards}
          />
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
