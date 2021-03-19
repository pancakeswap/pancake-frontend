import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import Page from 'components/layout/Page'
import RibbonWithImage from './components/RibbonWithImage'
import Section from './components/Section'
import Prizes from './svgs/Prizes'
import Ranks from './svgs/Ranks'

const TradingCompetition = () => {
  return (
    <Page>
      <Section>
        <RibbonWithImage imageComponent={<Prizes width="175px" />} ribbonDirection="up">
          Prizes
        </RibbonWithImage>
      </Section>
      <Section>
        <RibbonWithImage imageComponent={<Ranks width="175px" />} ribbonDirection="down">
          Team Ranks
        </RibbonWithImage>
      </Section>
    </Page>
  )
}

export default TradingCompetition
