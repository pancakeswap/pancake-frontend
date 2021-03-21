import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/hooks'
import { Card } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import styled from 'styled-components'
import RibbonWithImage from './components/RibbonWithImage'
import Section from './components/Section'
import Prizes from './svgs/Prizes'
import Ranks from './svgs/Ranks'
import { DARKBG, DARKFILL, MIDBLUEBG, MIDBLUEFILL } from './components/Section/sectionStyles'

const TradingCompetition = () => {
  return (
    <Page>
      <Section backgroundStyle={DARKBG} svgFill={DARKFILL} index={1}>
        <RibbonWithImage imageComponent={<Prizes width="175px" />} ribbonDirection="up">
          Prizes
        </RibbonWithImage>
      </Section>
      <Section
        backgroundStyle={MIDBLUEBG}
        svgFill={MIDBLUEFILL}
        index={2}
        intersectComponent={
          <RibbonWithImage imageComponent={<Ranks width="175px" />} ribbonDirection="down">
            Team Ranks
          </RibbonWithImage>
        }
      />
    </Page>
  )
}

export default TradingCompetition
