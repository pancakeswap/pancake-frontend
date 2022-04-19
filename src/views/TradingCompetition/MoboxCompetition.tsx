import { useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/profile/hooks'
import { Flex, Box } from '@pancakeswap/uikit'
import Image from 'next/image'
import { useTradingCompetitionContractMobox } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import {
  SmartContractPhases,
  CompetitionPhases,
  LIVE,
  FINISHED,
  CLAIM,
  OVER,
  REGISTRATION,
} from 'config/constants/trading-competition/phases'
import PageSection from 'components/PageSection'
import {
  DARKBG,
  MIDBLUEBG,
  MIDBLUEBG_DARK,
  LIGHTBLUEBG,
  LIGHTBLUEBG_DARK,
  TRADINGCOMPETITIONBANNER,
} from './pageSectionStyles'
import {
  PrizesIcon,
  //  RanksIcon,
  RulesIcon,
} from './svgs'
import Countdown from './components/Countdown'
import YourScore from './components/YourScore'
import StormBunny from './pngs/mbox-storm-bunny.png'
import RibbonWithImage from './components/RibbonWithImage'
import HowToJoin from './components/HowToJoin'
import BattleBanner from './components/BattleBanner'
import BattleCta from './components/BattleCta'
import PrizesInfo from './components/PrizesInfo'
import Rules from './components/Rules'
import { UserTradingInformationProps } from './types'
import { CompetitionPage, BannerFlex, BattleBannerSection, BottomBunnyWrapper } from './styles'
import TeamRanks from './components/TeamRanks'
import RanksIcon from './svgs/RanksIcon'

const MoboxCompetition = () => {
  const profileApiUrl = process.env.NEXT_PUBLIC_API_PROFILE
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { profile, isLoading } = useProfile()
  const { isDark, theme } = useTheme()
  const tradingCompetitionContract = useTradingCompetitionContractMobox(false)
  const [currentPhase, setCurrentPhase] = useState(CompetitionPhases.REGISTRATION)
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)
  const [claimSuccessful, setClaimSuccessful] = useState(false)
  const [userTradingInformation, setUserTradingInformation] = useState<UserTradingInformationProps>({
    hasRegistered: false,
    isUserActive: false,
    hasUserClaimed: false,
    userRewardGroup: '0',
    userCakeRewards: '0',
    userMoboxRewards: '0',
    userPointReward: '0',
    canClaimMysteryBox: false,
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

  const {
    hasUserClaimed,
    isUserActive,
    userCakeRewards,
    userMoboxRewards,
    userPointReward,
    canClaimMysteryBox,
    canClaimNFT,
  } = userTradingInformation

  const userCanClaimPrizes =
    currentPhase.state === CLAIM &&
    isUserActive &&
    !hasUserClaimed &&
    (userCakeRewards !== '0' ||
      userMoboxRewards !== '0' ||
      userPointReward !== '0' ||
      canClaimMysteryBox ||
      canClaimNFT)
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
      const competitionStatus = await tradingCompetitionContract.currentStatus()
      setCurrentPhase(SmartContractPhases[competitionStatus])
    }

    const fetchUserContract = async () => {
      try {
        const user = await tradingCompetitionContract.claimInformation(account)
        const userObject = {
          hasRegistered: user[0],
          isUserActive: user[1],
          hasUserClaimed: user[2],
          userRewardGroup: user[3].toString(),
          userCakeRewards: user[4].toString(),
          userMoboxRewards: user[5].toString(),
          userPointReward: user[6].toString(),
          canClaimMysteryBox: user[7],
          // canClaimNFT: user[8],
          // NOTE: Mobox Trading competition has a bug in claimInformation
          // that returns wrong canClaimNFT.
          // The bug is only in view function though, all other code is OK
          // recalculating canClaimNFT here to get proper boolean
          canClaimNFT: user[3].gt(1),
        }
        setUserTradingInformation(userObject)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCompetitionInfoContract()
    if (account) {
      fetchUserContract()
    } else {
      setUserTradingInformation({
        hasRegistered: false,
        isUserActive: false,
        hasUserClaimed: false,
        userRewardGroup: '0',
        userCakeRewards: '0',
        userMoboxRewards: '0',
        userPointReward: '0',
        canClaimMysteryBox: false,
        canClaimNFT: false,
      })
    }
  }, [account, registrationSuccessful, claimSuccessful, tradingCompetitionContract])

  useEffect(() => {
    const fetchUserTradingStats = async () => {
      const res = await fetch(`${profileApiUrl}/api/users/${account}`)
      const data = await res.json()
      setUserLeaderboardInformation(data.leaderboard_mobox)
    }
    // If user has not registered, user trading information will not be displayed and should not be fetched
    if (account && userTradingInformation.hasRegistered) {
      fetchUserTradingStats()
    }
  }, [account, userTradingInformation, profileApiUrl])

  useEffect(() => {
    const fetchGlobalLeaderboardStats = async () => {
      const res = await fetch(`${profileApiUrl}/api/leaderboard/3/global`)
      const data = await res.json()
      setGlobalLeaderboardInformation(data)
    }

    const fetchTeamsLeaderboardStats = async (teamId: number, callBack: (data: any) => void) => {
      try {
        const res = await fetch(`${profileApiUrl}/api/leaderboard/3/team/${teamId}`)
        const data = await res.json()
        callBack(data)
      } catch (e) {
        console.error(e)
      }
    }

    if (currentPhase.state !== REGISTRATION) {
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
    }
  }, [currentPhase, profileApiUrl])

  // Don't hide when loading. Hide if the account is connected && the user hasn't registered && the competition is live or finished
  const shouldHideCta =
    !isLoading && account && !userTradingInformation.hasRegistered && (isCompetitionLive || hasCompetitionEnded)

  return (
    <>
      <PageMeta />
      <CompetitionPage id="pcs-competition-page">
        <BattleBannerSection background={TRADINGCOMPETITIONBANNER} hasCurvedDivider={false} index={1}>
          <BannerFlex mb={shouldHideCta ? '0px' : '48px'}>
            <Countdown currentPhase={currentPhase} hasCompetitionEnded={hasCompetitionEnded} />
            <BattleBanner />
          </BannerFlex>
        </BattleBannerSection>
        <PageSection
          containerProps={{ style: { marginTop: '-30px' } }}
          background={isDark ? MIDBLUEBG_DARK : MIDBLUEBG}
          concaveDivider
          clipFill={{ light: '#CCD8F0', dark: '#434575' }}
          dividerPosition="top"
          index={2}
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
          <Box mt={shouldHideCta ? '0px' : ['94px', null, '36px']} mb="64px">
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
        {currentPhase.state !== REGISTRATION && (
          <PageSection
            containerProps={{ style: { marginTop: '-30px' } }}
            index={3}
            concaveDivider
            clipFill={{ light: theme.colors.background }}
            dividerPosition="top"
            dividerComponent={
              <RibbonWithImage imageComponent={<RanksIcon width="175px" />} ribbonDirection="up">
                {t('Team Ranks')}
              </RibbonWithImage>
            }
          >
            <Box my="64px">
              <TeamRanks
                team1LeaderboardInformation={team1LeaderboardInformation}
                team2LeaderboardInformation={team2LeaderboardInformation}
                team3LeaderboardInformation={team3LeaderboardInformation}
                globalLeaderboardInformation={globalLeaderboardInformation}
              />
            </Box>
          </PageSection>
        )}
        <PageSection
          containerProps={{ style: { marginTop: '-30px' } }}
          dividerComponent={
            <RibbonWithImage imageComponent={<PrizesIcon width="175px" />} ribbonDirection="up">
              {t('Prizes')}
            </RibbonWithImage>
          }
          concaveDivider
          clipFill={{
            light: 'linear-gradient(139.73deg, #e5fcfe 0%, #ecf6ff 100%)',
            dark: 'linear-gradient(139.73deg, #303d5b 0%, #363457 100%)',
          }}
          dividerPosition="top"
          background={isDark ? LIGHTBLUEBG_DARK : LIGHTBLUEBG}
          index={4}
        >
          <Box my="64px">
            <PrizesInfo />
          </Box>
        </PageSection>
        <PageSection
          containerProps={{ style: { marginTop: '-1px' } }}
          index={5}
          dividerPosition="top"
          clipFill={{
            light: 'linear-gradient(139.73deg, #ecf5ff 0%, #f2effe 100%)',
            dark: 'linear-gradient(139.73deg, #383357 0%, #3d2b53 100%)',
          }}
          dividerComponent={
            <RibbonWithImage imageComponent={<RulesIcon width="175px" />} ribbonDirection="up">
              {t('Rules')}
            </RibbonWithImage>
          }
        >
          <Box mt="64px">
            <Rules />
          </Box>
        </PageSection>
        <PageSection
          index={6}
          dividerPosition="top"
          dividerFill={{ light: '#191326' }}
          clipFill={{ light: theme.colors.background }}
          background={DARKBG}
        >
          <Flex alignItems="center">
            <BottomBunnyWrapper>
              <Image src={StormBunny} width={254} height={227} />
            </BottomBunnyWrapper>
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
          </Flex>
        </PageSection>
      </CompetitionPage>
    </>
  )
}

export default MoboxCompetition
