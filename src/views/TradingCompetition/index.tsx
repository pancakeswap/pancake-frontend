import React from 'react'
import styled from 'styled-components'
import { DARKBG, DARKFILL } from './components/Section/sectionStyles'
import PreviewBattleBanner from './components/PreviewComponents/PreviewBattleBanner'
import PreviewSection from './components/PreviewComponents/PreviewSection'

const CompetitionPage = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
`

const TradingCompetition = () => {
  return (
    <CompetitionPage>
      <PreviewSection backgroundStyle={DARKBG} svgFill={DARKFILL} index={2} noIntersection>
        <PreviewBattleBanner />
      </PreviewSection>
    </CompetitionPage>
  )
}

export default TradingCompetition
