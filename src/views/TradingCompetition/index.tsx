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
  const { profile, isInitialized, isLoading } = useProfile()
  const tradingCompetitionContract = useTradingCompetitionContract()
  const [userRegisteredForCompetition, setUserRegisteredForCompetition] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await tradingCompetitionContract.methods.userTradingStats(account).call()
      setUserRegisteredForCompetition(user.hasRegistered)
    }
    if (account) {
      fetchUser()
    }
  }, [account, tradingCompetitionContract])

  const registered = false
  const isCompetitionLive = false
  const hasCompetitionStarted = false
  return (
    <CompetitionPage>
      <Section
        backgroundStyle={DARKBG}
        svgFill={DARKFILL}
        index={4}
        intersectComponent={
          <BattleCta
            registered={registered}
            account={account}
            isCompetitionLive={isCompetitionLive}
            profile={profile}
            isInitialized={isInitialized}
            isLoading={isLoading}
          />
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
        <SampleCard />
      </Section>
    </CompetitionPage>
  )
}

export default TradingCompetition
