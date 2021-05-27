import React, { useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import { Flex, Box, Image } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTradingCompetitionContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import {
  SmartContractPhases,
  CompetitionPhases,
  LIVE,
  FINISHED,
  CLAIM,
  OVER,
  REGISTRATION,
} from 'config/constants/trading-competition/easterPhases'
import PageSection from 'components/PageSection'
import {
  DARKBG,
  DARKFILL,
  MIDBLUEBG,
  MIDBLUEBG_DARK,
  MIDBLUEFILL,
  MIDBLUEFILL_DARK,
  LIGHTBLUEBG,
  LIGHTBLUEBG_DARK,
  LIGHTBLUEFILL,
  LIGHTBLUEFILL_DARK,
} from './pageSectionStyles'
import { PrizesIcon, RanksIcon, RulesIcon } from './svgs'
import Countdown from './components/Countdown'
import YourScore from './components/YourScore'
import StormBunny from './pngs/storm.png'
import RibbonWithImage from './components/RibbonWithImage'
import HowToJoin from './components/HowToJoin'
import BattleBanner from './components/BattleBanner'
import BattleCta from './components/BattleCta'
import PrizesInfo from './components/PrizesInfo'
import Rules from './components/Rules'
import TeamRanks from './components/TeamRanks'

const CompetitionPage = styled.div`
  min-height: calc(100vh - 64px);
`

const BannerFlex = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    padding-top: 10px;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  @media screen and (min-width: 1920px) {
    padding-top: 32px;
  }
`

const PrizesSection = styled(PageSection)`
  margin: -32px 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: -64px 0;
  }
`

const BottomBunnyWrapper = styled(Box)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    margin-left: 40px;
    width: 147px;
    height: 200px;
  }
`

const TradingCompetition = () => {
  const profileApiUrl = process.env.REACT_APP_API_PROFILE
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { profile, isLoading } = useProfile()
  const { isDark } = useTheme()
  const tradingCompetitionContract = useTradingCompetitionContract()
  const [currentPhase, setCurrentPhase] = useState(CompetitionPhases.LIVE)
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)
  const [claimSuccessful, setClaimSuccessful] = useState(false)
  const [userTradingInformation, setUserTradingInformation] = useState({
    hasRegistered: false,
    hasUserClaimed: false,
    userRewardGroup: '0',
    userCakeRewards: '0',
    userPointReward: '0',
    canClaimNFT: false,
  })
  const [globalLeaderboardInformation, setGlobalLeaderboardInformation] = useState(null)
  const [userLeaderboardInformation, setUserLeaderboardInformation] = useState({
    global: 0,
    team: 0,
    volume: 0,
    next_rank: 0,
  })
  // 1. Storm
  const [team1LeaderboardInformation, setTeam1LeaderboardInformation] = useState({ teamId: 1, leaderboardData: null })
  // 2. Flippers
  const [team2LeaderboardInformation, setTeam2LeaderboardInformation] = useState({ teamId: 2, leaderboardData: null })
  // 3. Cakers
  const [team3LeaderboardInformation, setTeam3LeaderboardInformation] = useState({ teamId: 3, leaderboardData: null })

  const isCompetitionLive = currentPhase.state === LIVE
  const hasCompetitionEnded =
    currentPhase.state === FINISHED || currentPhase.state === CLAIM || currentPhase.state === OVER

  const { hasUserClaimed, userCakeRewards, userPointReward, canClaimNFT } = userTradingInformation

  const userCanClaimPrizes =
    currentPhase.state === CLAIM &&
    !hasUserClaimed &&
    (userCakeRewards !== '0' || userPointReward !== '0' || canClaimNFT)
  const finishedAndPrizesClaimed = hasCompetitionEnded && account && hasUserClaimed
  const finishedAndNothingToClaim = hasCompetitionEnded && account && !userCanClaimPrizes

  const onRegisterSuccess = () => {
    setRegistrationSuccessful(true)
  }

  const onClaimSuccess = () => {
    setClaimSuccessful(true)
  }

  useEffect(() => {
    const fetchCompetitionInfoContract = async () => {
      const competitionStatus = await tradingCompetitionContract.methods.currentStatus().call()
      setCurrentPhase(SmartContractPhases[competitionStatus])
    }

    const fetchUserContract = async () => {
      const user = await tradingCompetitionContract.methods.claimInformation(account).call()
      const userObject = {
        hasRegistered: user[0],
        hasUserClaimed: user[1],
        userRewardGroup: user[2],
        userCakeRewards: user[3],
        userPointReward: user[4],
        canClaimNFT: user[5],
      }
      setUserTradingInformation(userObject)
    }

    if (account) {
      fetchUserContract()
    } else {
      setUserTradingInformation({
        hasRegistered: false,
        hasUserClaimed: false,
        userRewardGroup: '0',
        userCakeRewards: '0',
        userPointReward: '0',
        canClaimNFT: false,
      })
    }
    fetchCompetitionInfoContract()
  }, [account, registrationSuccessful, claimSuccessful, tradingCompetitionContract])

  useEffect(() => {
    const fetchUserTradingStats = async () => {
      const res = await fetch(`${profileApiUrl}/api/users/${account}`)
      const data = await res.json()
      setUserLeaderboardInformation(data.leaderboard)
    }
    // If user has not registered, user trading information will not be displayed and should not be fetched
    if (account && userTradingInformation.hasRegistered) {
      fetchUserTradingStats()
    }
  }, [account, userTradingInformation, profileApiUrl])

  useEffect(() => {
    const fetchGlobalLeaderboardStats = async () => {
      const res = await fetch(`${profileApiUrl}/api/leaderboard/global`)
      const data = await res.json()
      setGlobalLeaderboardInformation(data)
    }

    const fetchTeamsLeaderboardStats = async (teamId: number, callBack: (data: any) => void) => {
      try {
        const res = await fetch(`${profileApiUrl}/api/leaderboard/team/${teamId}`)
        const data = await res.json()
        callBack(data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchTeamsLeaderboardStats(1, (data) =>
      setTeam1LeaderboardInformation((prevState) => {
        return { ...prevState, leaderboardData: data }
      }),
    )
    fetchTeamsLeaderboardStats(2, (data) =>
      setTeam2LeaderboardInformation((prevState) => {
        return { ...prevState, leaderboardData: data }
      }),
    )
    fetchTeamsLeaderboardStats(3, (data) =>
      setTeam3LeaderboardInformation((prevState) => {
        return { ...prevState, leaderboardData: data }
      }),
    )
    fetchGlobalLeaderboardStats()
  }, [profileApiUrl])

  // Don't hide when loading. Hide if the account is connected && the user hasn't registered && the competition is live or finished
  const shouldHideCta =
    !isLoading && account && !userTradingInformation.hasRegistered && (isCompetitionLive || hasCompetitionEnded)

  return (
    <CompetitionPage>
      <PageSection
        background={DARKBG}
        svgFill={DARKFILL}
        index={5}
        dividerComponent={
          shouldHideCta ? null : (
            <BattleCta
              userTradingInformation={userTradingInformation}
              currentPhase={currentPhase}
              account={account}
              isCompetitionLive={isCompetitionLive}
              hasCompetitionEnded={hasCompetitionEnded}
              userCanClaimPrizes={userCanClaimPrizes}
              finishedAndPrizesClaimed={finishedAndPrizesClaimed}
              finishedAndNothingToClaim={finishedAndNothingToClaim}
              profile={profile}
              isLoading={isLoading}
              onRegisterSuccess={onRegisterSuccess}
              onClaimSuccess={onClaimSuccess}
            />
          )
        }
      >
        <BannerFlex mb={shouldHideCta ? '0px' : '48px'}>
          <Countdown currentPhase={currentPhase} hasCompetitionEnded={hasCompetitionEnded} />
          <BattleBanner />
        </BannerFlex>
      </PageSection>
      <PageSection
        background={isDark ? MIDBLUEBG_DARK : MIDBLUEBG}
        svgFill={isDark ? MIDBLUEFILL_DARK : MIDBLUEFILL}
        index={4}
        dividerComponent={
          <RibbonWithImage imageComponent={<RanksIcon width="175px" />} ribbonDirection="up">
            {t('Team Ranks')}
          </RibbonWithImage>
        }
      >
        <Box mt={shouldHideCta ? '0px' : ['94px', null, '36px']} mb={['24px', null, '0']}>
          {/* If competition has not yet started, render HowToJoin component - if not, render YourScore */}
          {currentPhase.state === REGISTRATION ? (
            <HowToJoin />
          ) : (
            <YourScore
              currentPhase={currentPhase}
              hasRegistered={userTradingInformation.hasRegistered}
              userTradingInformation={userTradingInformation}
              account={account}
              profile={profile}
              isLoading={isLoading}
              userLeaderboardInformation={userLeaderboardInformation}
              userCanClaimPrizes={userCanClaimPrizes}
              finishedAndPrizesClaimed={finishedAndPrizesClaimed}
              finishedAndNothingToClaim={finishedAndNothingToClaim}
              onClaimSuccess={onClaimSuccess}
            />
          )}
        </Box>
      </PageSection>
      <PageSection
        index={3}
        dividerComponent={
          <RibbonWithImage imageComponent={<PrizesIcon width="175px" />} ribbonDirection="up">
            {t('Prizes')}
          </RibbonWithImage>
        }
      >
        <Box mt="54px">
          <TeamRanks
            team1LeaderboardInformation={team1LeaderboardInformation}
            team2LeaderboardInformation={team2LeaderboardInformation}
            team3LeaderboardInformation={team3LeaderboardInformation}
            globalLeaderboardInformation={globalLeaderboardInformation}
          />
        </Box>
      </PageSection>
      <PrizesSection
        background={isDark ? LIGHTBLUEBG_DARK : LIGHTBLUEBG}
        svgFill={isDark ? LIGHTBLUEFILL_DARK : LIGHTBLUEFILL}
        index={2}
        hasCurvedDivider={false}
      >
        <Box my="64px">
          <PrizesInfo />
        </Box>
      </PrizesSection>
      <PageSection
        index={3}
        curvePosition="top"
        dividerComponent={
          <RibbonWithImage imageComponent={<RulesIcon width="175px" />} ribbonDirection="up">
            {t('Rules')}
          </RibbonWithImage>
        }
      >
        <Rules />
      </PageSection>
      <PageSection background={DARKBG} svgFill={DARKFILL} index={4} curvePosition="top">
        <Flex alignItems="center">
          {shouldHideCta ? null : (
            <Flex height="fit-content">
              <BattleCta
                userTradingInformation={userTradingInformation}
                currentPhase={currentPhase}
                account={account}
                isCompetitionLive={isCompetitionLive}
                hasCompetitionEnded={hasCompetitionEnded}
                userCanClaimPrizes={userCanClaimPrizes}
                finishedAndPrizesClaimed={finishedAndPrizesClaimed}
                finishedAndNothingToClaim={finishedAndNothingToClaim}
                profile={profile}
                isLoading={isLoading}
                onRegisterSuccess={onRegisterSuccess}
                onClaimSuccess={onClaimSuccess}
              />
            </Flex>
          )}
          <BottomBunnyWrapper>
            <Image src={StormBunny} width={147} height={200} />
          </BottomBunnyWrapper>
        </Flex>
      </PageSection>
    </CompetitionPage>
  )
}

export default TradingCompetition
