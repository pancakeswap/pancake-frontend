import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/profile/hooks'
import { Flex, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTradingCompetitionContractEaster } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
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
import { DARKBG, MIDBLUEBG, MIDBLUEBG_DARK } from './pageSectionStyles'
import EasterStormBunny from './pngs/easter-storm.png'
import Countdown from './components/Countdown'
import HowToJoin from './components/HowToJoin'
import BattleCta from './components/BattleCta'
import EasterBattleBanner from './easter/components/BattleBanner/EasterBattleBanner'
import EasterPrizesInfo from './easter/components/PrizesInfo/EasterPrizesInfo'
import EasterYourScore from './easter/components/YourScore/EasterYourScore'
import EasterCakerBunny from './pngs/easter-cakers.png'
import { useTeamInformation } from './useTeamInformation'
import { useRegistrationClaimStatus } from './useRegistrationClaimStatus'
import Footer from './Footer'
import TeamRanksSection from './components/TeamRanksSection'
import PrizesInfoSection from './components/PrizesInfoSection'

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

const EasterCompetition = () => {
  const profileApiUrl = process.env.NEXT_PUBLIC_API_PROFILE
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()
  const { profile, isLoading } = useProfile()
  const { isDark } = useTheme()
  const tradingCompetitionContract = useTradingCompetitionContractEaster(false)
  const [currentPhase, setCurrentPhase] = useState(CompetitionPhases.OVER)
  const { registrationSuccessful, claimSuccessful, onRegisterSuccess, onClaimSuccess } = useRegistrationClaimStatus()
  const [userTradingInformation, setUserTradingInformation] = useState({
    hasRegistered: false,
    hasUserClaimed: false,
    userRewardGroup: '0',
    userCakeRewards: '0',
    userPointReward: '0',
    canClaimNFT: false,
  })
  const [userLeaderboardInformation, setUserLeaderboardInformation] = useState({
    global: 0,
    team: 0,
    volume: 0,
    next_rank: 0,
  })

  const {
    globalLeaderboardInformation,
    team1LeaderboardInformation,
    team2LeaderboardInformation,
    team3LeaderboardInformation,
  } = useTeamInformation(1)

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

  useEffect(() => {
    const fetchCompetitionInfoContract = async () => {
      const competitionStatus = await tradingCompetitionContract.currentStatus()
      setCurrentPhase(SmartContractPhases[competitionStatus])
    }

    const fetchUserContract = async () => {
      const user = await tradingCompetitionContract.claimInformation(account)
      const userObject = {
        hasRegistered: user[0],
        hasUserClaimed: user[1],
        userRewardGroup: user[2].toString(),
        userCakeRewards: user[3].toString(),
        userPointReward: user[4].toString(),
        canClaimNFT: user[5],
      }
      setUserTradingInformation(userObject)
    }

    if (account) {
      fetchUserContract()
      fetchCompetitionInfoContract()
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

  // Don't hide when loading. Hide if the account is connected && the user hasn't registered && the competition is live or finished
  const shouldHideCta =
    !isLoading && account && !userTradingInformation.hasRegistered && (isCompetitionLive || hasCompetitionEnded)

  return (
    <CompetitionPage>
      <PageSection
        style={{ paddingTop: '0px' }}
        innerProps={{ style: { paddingTop: isMobile ? '30px' : '28px' } }}
        background={DARKBG}
        hasCurvedDivider={false}
        index={1}
      >
        <BannerFlex mb={shouldHideCta ? '0px' : '48px'}>
          <Countdown currentPhase={currentPhase} hasCompetitionEnded={hasCompetitionEnded} />
          <EasterBattleBanner />
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
            <EasterYourScore
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
      <TeamRanksSection
        image={EasterCakerBunny}
        team1LeaderboardInformation={team1LeaderboardInformation}
        team2LeaderboardInformation={team2LeaderboardInformation}
        team3LeaderboardInformation={team3LeaderboardInformation}
        globalLeaderboardInformation={globalLeaderboardInformation}
      />
      <PrizesInfoSection prizesInfoComponent={<EasterPrizesInfo />} />
      <Footer
        shouldHideCta={shouldHideCta}
        image={EasterStormBunny}
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
  )
}

export default EasterCompetition
