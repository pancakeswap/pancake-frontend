import { useState, useEffect } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/profile/hooks'
import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTradingCompetitionContractMobox } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { TC_MOBOX_SUBGRAPH } from 'config/constants/endpoints'
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
import { MIDBLUEBG, MIDBLUEBG_DARK, TRADINGCOMPETITIONBANNER } from './pageSectionStyles'
import {
  //  RanksIcon,
  RulesIcon,
} from './svgs'
import Countdown from './components/Countdown'
import StormBunny from './pngs/mobox-storm-bunny.png'
import RibbonWithImage from './components/RibbonWithImage'
import HowToJoin from './components/HowToJoin'
import BattleCta from './components/BattleCta'
import Rules from './components/Rules'
import { UserTradingInformation } from './types'
import { CompetitionPage, BannerFlex } from './styles'
import RanksIcon from './svgs/RanksIcon'
import MoboxYourScore from './mobox/components/YourScore/MoboxYourScore'
import MoboxBattleBanner from './mobox/components/BattleBanner/MoboxBattleBanner'
import MoboxPrizesInfo from './mobox/components/PrizesInfo/MoboxPrizesInfo'
import { useTeamInformation } from './useTeamInformation'
import { useRegistrationClaimStatus } from './useRegistrationClaimStatus'
import Footer from './Footer'
import PrizesInfoSection from './components/PrizesInfoSection'
import TeamRanksWithParticipants from './components/TeamRanks/TeamRanksWithParticipants'
import MoboxCakerBunny from './pngs/mobox-cakers.png'

const MoboxCompetition = () => {
  const profileApiUrl = process.env.NEXT_PUBLIC_API_PROFILE
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { profile, isLoading } = useProfile()
  const { isDark, theme } = useTheme()
  const tradingCompetitionContract = useTradingCompetitionContractMobox(false)
  const [currentPhase, setCurrentPhase] = useState(CompetitionPhases.OVER)
  const { registrationSuccessful, claimSuccessful, onRegisterSuccess, onClaimSuccess } = useRegistrationClaimStatus()
  const [userTradingInformation, setUserTradingInformation] = useState<UserTradingInformation>({
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
  const [userLeaderboardInformation, setUserLeaderboardInformation] = useState({
    global: 0,
    team: 0,
    volume: 0,
    next_rank: 0,
    moboxVolumeRank: '???',
    moboxVolume: '???',
  })

  const {
    globalLeaderboardInformation,
    team1LeaderboardInformation,
    team2LeaderboardInformation,
    team3LeaderboardInformation,
  } = useTeamInformation(3)

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

  // Don't hide when loading. Hide if the account is connected && the user hasn't registered && the competition is live or finished
  const shouldHideCta =
    !isLoading && account && !userTradingInformation.hasRegistered && (isCompetitionLive || hasCompetitionEnded)

  return (
    <>
      <PageMeta />
      <CompetitionPage id="pcs-competition-page">
        <PageSection
          style={{ paddingTop: '0px' }}
          innerProps={{ style: { paddingTop: isMobile ? '30px' : '28px' } }}
          background={TRADINGCOMPETITIONBANNER}
          hasCurvedDivider={false}
          index={1}
        >
          <BannerFlex mb={shouldHideCta ? '0px' : '48px'}>
            <Countdown currentPhase={currentPhase} hasCompetitionEnded={hasCompetitionEnded} />
            <MoboxBattleBanner />
          </BannerFlex>
        </PageSection>
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
              <MoboxYourScore
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
              <TeamRanksWithParticipants
                image={MoboxCakerBunny}
                team1LeaderboardInformation={team1LeaderboardInformation}
                team2LeaderboardInformation={team2LeaderboardInformation}
                team3LeaderboardInformation={team3LeaderboardInformation}
                globalLeaderboardInformation={globalLeaderboardInformation}
                participantSubgraphAddress={TC_MOBOX_SUBGRAPH}
                subgraphName="pancakeswap/trading-competition-v3"
              />
            </Box>
          </PageSection>
        )}
        <PrizesInfoSection prizesInfoComponent={<MoboxPrizesInfo />} />
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
        <Footer
          shouldHideCta={shouldHideCta}
          image={StormBunny}
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
      </CompetitionPage>
    </>
  )
}

export default MoboxCompetition
