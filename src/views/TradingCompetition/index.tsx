import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import { Card, CardHeader, CardBody, Flex, Button } from '@pancakeswap-libs/uikit'
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
import RibbonWithImage from './components/RibbonWithImage'
import HowToJoin from './components/HowToJoin'
import BattleBanner from './components/BattleBanner'
import Section from './components/Section'
import BattleCta from './components/BattleCta'
import PrizesInfo from './components/PrizesInfo'
import Rules from './components/Rules'

const SampleCard = () => (
  <Card>
    <CardHeader>A header</CardHeader>
    <CardBody>
      <Flex flexDirection="column">
        Some body stuff{' '}
        <Button mt="8px" onClick={() => console.log('clicked')}>
          Click me
        </Button>
      </Flex>
    </CardBody>
  </Card>
)

const CompetitionPage = styled.div`
  min-height: calc(100vh - 64px);
`

const StyledSection = styled(Section)`
  padding: 96px 0 24px 0;
`

const TradingCompetition = () => {
  const { account } = useWeb3React()
  const { profile, isLoading } = useProfile()
  const tradingCompetitionContract = useTradingCompetitionContract()
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false)
  const [userTradingInformation, setUserTradingInformation] = useState({
    hasRegistered: false,
    hasUserClaimed: false,
    userRewardGroup: '0',
    userCakeRewards: '0',
    userPointReward: '0',
    canClaimNFT: false,
  })

  const hasCompetitionFinished = false
  const isCompetitionLive = false
  // Ignore this. It's part of the root branch, will all be removed when the countdown state is in.
  const hasCompetitionStarted = false

  const onRegisterSuccess = () => {
    setRegistrationSuccessful(true)
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
      debugger // eslint-disable-line no-debugger
      setUserTradingInformation(userObject)
    }
    if (account) {
      fetchUser()
    }
  }, [account, registrationSuccessful, tradingCompetitionContract])

  console.log('registered? ', userTradingInformation.hasRegistered)

  // if the account is connected, the user hasn't registered and the competition is live or finished - hide cta
  const shouldHideCta =
    account && !userTradingInformation.hasRegistered && (isCompetitionLive || hasCompetitionFinished)

  return (
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
            />
          )
        }
      >
        <BattleBanner />
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
        {!hasCompetitionStarted ? <HowToJoin /> : <SampleCard />}
      </Section>
      <StyledSection backgroundStyle={LIGHTBLUEBG} svgFill={LIGHTBLUEFILL} index={2} noIntersection>
        <PrizesInfo />
      </StyledSection>
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
        {shouldHideCta ? null : (
          <BattleCta
            userTradingInformation={userTradingInformation}
            account={account}
            isCompetitionLive={isCompetitionLive}
            hasCompetitionFinished={hasCompetitionFinished}
            profile={profile}
            isLoading={isLoading}
            onRegisterSuccess={onRegisterSuccess}
          />
        )}
      </Section>
    </CompetitionPage>
  )
}

export default TradingCompetition
