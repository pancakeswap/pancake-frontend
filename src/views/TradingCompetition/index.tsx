import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import { Card, CardHeader, CardBody, Flex, Button } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import styled from 'styled-components'
import RibbonWithImage from './components/RibbonWithImage'
import Section from './components/Section'
import BattleCta from './components/BattleCta'
import Prizes from './svgs/Prizes'
import Ranks from './svgs/Ranks'
import {
  DARKBG,
  DARKFILL,
  MIDBLUEBG,
  MIDBLUEFILL,
  LIGHTBLUEBG,
  LIGHTBLUEFILL,
} from './components/Section/sectionStyles'

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

const TradingCompetition = () => {
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const registered = true
  const isCompetitionLive = false

  return (
    <CompetitionPage>
      <Section
        backgroundStyle={DARKBG}
        svgFill={DARKFILL}
        index={4}
        intersectComponent={
          <BattleCta registered={registered} account={account} isCompetitionLive={isCompetitionLive} />
        }
      >
        <SampleCard />
      </Section>
      <Section backgroundStyle={MIDBLUEBG} svgFill={MIDBLUEFILL} index={3} intersectComponent={<SampleCard />} />
      <Section backgroundStyle={LIGHTBLUEBG} svgFill={LIGHTBLUEFILL} index={2}>
        <RibbonWithImage imageComponent={<Prizes width="175px" />} ribbonDirection="down">
          Light blue
        </RibbonWithImage>
      </Section>
      <Section index={3} intersectionPosition="top">
        <SampleCard />
        <RibbonWithImage imageComponent={<Prizes width="175px" />} ribbonDirection="up">
          Intersect top
        </RibbonWithImage>
      </Section>
    </CompetitionPage>
  )
}

export default TradingCompetition
