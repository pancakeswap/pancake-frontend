import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import { Flex, Box, Image } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useTradingCompetitionContract } from 'hooks/useContract'
import { PrizesIcon, RulesIcon } from './svgs'
import {
  DARKBG,
  DARKFILL,
  MIDBLUEBG,
  MIDBLUEFILL,
  LIGHTBLUEBG,
  LIGHTBLUEFILL,
} from './components/Section/sectionStyles'
import Countdown from './components/Countdown'
import StormBunny from './pngs/storm.png'
import RibbonWithImage from './components/RibbonWithImage'
import HowToJoin from './components/HowToJoin'
import BattleBanner from './components/BattleBanner'
import Section from './components/Section'
import BattleCta from './components/BattleCta'
import PrizesInfo from './components/PrizesInfo'
import Rules from './components/Rules'
import { CompetitionCountdownContextProvider } from './contexts/CompetitionCountdownContext'

const CompetitionPage = styled.div`
  min-height: calc(100vh - 64px);
`

const StyledFlex = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row-reverse;
    justify-content: space-between;
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
  const { account } = useWeb3React()
  const { profile, isLoading } = useProfile()
  const tradingCompetitionContract = useTradingCompetitionContract()
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

  // These should be replaced with actual 'state' calls when smart contracts are deployed to live and testnet is no longer needed
  const isCompetitionLive = false
  const hasCompetitionFinished = false

  const onRegisterSuccess = () => {
    setRegistrationSuccessful(true)
  }

  const onClaimSuccess = () => {
    setClaimSuccessful(true)
  }

  useEffect(() => {
    const fetchUser = async () => {
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
      fetchUser()
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

  // Don't hide when loading. Hide if the account is connected, the user hasn't registered and the competition is live or finished
  const shouldHideCta =
    !isLoading && account && !userTradingInformation.hasRegistered && (isCompetitionLive || hasCompetitionFinished)

  return (
    <CompetitionCountdownContextProvider>
      <CompetitionPage>
        <Section
          backgroundStyle={DARKBG}
          svgFill={DARKFILL}
          index={4}
          intersectComponent={
            shouldHideCta ? null : (
              <BattleCta
                userTradingInformation={userTradingInformation}
                account={account}
                isCompetitionLive={isCompetitionLive}
                hasCompetitionFinished={hasCompetitionFinished}
                profile={profile}
                isLoading={isLoading}
                onRegisterSuccess={onRegisterSuccess}
                onClaimSuccess={onClaimSuccess}
              />
            )
          }
        >
          <StyledFlex mb={shouldHideCta ? '0px' : '48px'}>
            <Countdown />
            <BattleBanner />
          </StyledFlex>
        </Section>
        <Section
          backgroundStyle={MIDBLUEBG}
          svgFill={MIDBLUEFILL}
          index={3}
          intersectComponent={
            <RibbonWithImage imageComponent={<PrizesIcon width="175px" />} ribbonDirection="up">
              Prizes
            </RibbonWithImage>
          }
        >
          {/* If competition has not yet started, render HowToJoin component - 
          if not, render trading competition rankings
          */}
          <Box mt={shouldHideCta ? '0px' : '54px'}>
            {!isCompetitionLive && !hasCompetitionFinished ? <HowToJoin /> : <div />}
          </Box>
        </Section>
        <Section backgroundStyle={LIGHTBLUEBG} svgFill={LIGHTBLUEFILL} index={2} noIntersection>
          <Box mb="78px">
            <PrizesInfo />
          </Box>
        </Section>
        <Section
          index={3}
          intersectionPosition="top"
          intersectComponent={
            <RibbonWithImage imageComponent={<RulesIcon width="175px" />} ribbonDirection="up">
              Rules
            </RibbonWithImage>
          }
        >
          <Rules />
        </Section>
        <Section backgroundStyle={DARKBG} svgFill={DARKFILL} index={4} intersectionPosition="top">
          <Flex alignItems="center">
            {shouldHideCta ? null : (
              <Flex height="fit-content">
                <BattleCta
                  userTradingInformation={userTradingInformation}
                  account={account}
                  isCompetitionLive={isCompetitionLive}
                  hasCompetitionFinished={hasCompetitionFinished}
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
        </Section>
      </CompetitionPage>
    </CompetitionCountdownContextProvider>
  )
}

export default TradingCompetition
