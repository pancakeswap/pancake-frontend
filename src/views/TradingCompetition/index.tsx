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
  const [userTradingStats, setUserTradingStats] = useState({ hasRegistered: false, hasClaimed: false })
  const [userCanClaim, setUserCanClaim] = useState(false)
  const [userRewards, setUserRewards] = useState(null)
  const [teamRewards, setTeamRewards] = useState(null)

  const hasCompetitionFinished = true
  const isCompetitionLive = false
  const hasCompetitionStarted = false

  useEffect(() => {
    const fetchUser = async () => {
      const user = await tradingCompetitionContract.methods.userTradingStats(account).call()
      setUserTradingStats(user)
    }
    if (account) {
      fetchUser()
    }
  }, [account, tradingCompetitionContract])

  useEffect(() => {
    const fetchUserRewards = async () => {
      const claimData = await tradingCompetitionContract.methods.canClaim(account).call()
      const cakeToClaim = claimData[1]
      const pointsToClaim = claimData[2]
      const userCakeAndPoints = { cakeToClaim, pointsToClaim }
      setUserCanClaim(claimData[0])
      setUserRewards(userCakeAndPoints)
    }

    const fetchTeamRewards = async () => {
      const teamRewardResponse = await tradingCompetitionContract.methods.viewRewardTeams().call()
      setTeamRewards(teamRewardResponse)
    }

    if (account && hasCompetitionFinished) {
      fetchUserRewards()
      fetchTeamRewards()
    }
  }, [account, tradingCompetitionContract, hasCompetitionFinished])

  // if the account is connected, the user hasn't registered and the competition is live or finished - hide cta
  const shouldHideCta = account && !userTradingStats.hasRegistered && (isCompetitionLive || hasCompetitionFinished)

  return (
    <CompetitionPage>
      <Section
        backgroundStyle={DARKBG}
        svgFill={DARKFILL}
        index={4}
        intersectComponent={
          shouldHideCta ? null : (
            <BattleCta
              userTradingStats={userTradingStats}
              account={account}
              isCompetitionLive={isCompetitionLive}
              hasCompetitionFinished={hasCompetitionFinished}
              profile={profile}
              isLoading={isLoading}
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
            userTradingStats={userTradingStats}
            account={account}
            isCompetitionLive={isCompetitionLive}
            profile={profile}
            isLoading={isLoading}
          />
        )}
      </Section>
    </CompetitionPage>
  )
}

export default TradingCompetition
