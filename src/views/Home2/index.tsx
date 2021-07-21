import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import useFetchLotteryForPromos from 'views/Home/hooks/useFetchLotteryForPromos'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import { HERO_BOTTOM_BG, HERO_SVG_BOTTOM, HERO_TOP_BG } from './pageSectionStyles'
import Hero from './Components/Hero'
import { swapSectionData, earnSectionData, cakeSectionData } from './Components/SalesSection/data'
import SalesSection from './Components/SalesSection'
import WinSection from './Components/WinSection'

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { currentLotteryPrize } = useFetchLotteryForPromos()
  const { theme } = useTheme()

  return (
    <>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...swapSectionData} />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={theme.colors.gradients.cardHeader}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...earnSectionData} />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background="linear-gradient(180deg, #6FB6F1 0%, #EAF2F6 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <WinSection />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
        <SalesSection {...cakeSectionData} />
      </PageSection>
    </>
  )
}

export default Home
