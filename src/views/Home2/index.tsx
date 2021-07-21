import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import useFetchLotteryForPromos from 'views/Home/hooks/useFetchLotteryForPromos'
import PageSection from 'components/PageSection'
import { HERO_BOTTOM_BG, HERO_SVG_BOTTOM, HERO_TOP_BG } from './pageSectionStyles'
import Hero from './Components/Hero'

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { currentLotteryPrize } = useFetchLotteryForPromos()

  return (
    <>
      {/* <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={HERO_TOP_BG}
        p="24px 0"
        index={2}
        hasCurvedDivider={false}
      >
        <Hero />
      </PageSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={HERO_BOTTOM_BG}
        p="24px 0"
        index={2}
        concaveDivider
        concaveBackgroundLight={HERO_SVG_BOTTOM}
        curvePosition="bottom"
      >
        <Hero />
      </PageSection> */}
    </>
  )
}

export default Home
