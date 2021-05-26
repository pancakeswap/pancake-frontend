import React from 'react'
import styled from 'styled-components'
import { Heading } from '@pancakeswap/uikit'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { TITLEBG, TITLEFILL, GETTICKETSBG, FINISHEDROUNDSBG, FINISHEDROUNDSBG_DARK } from './pageSectionStyles'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const LotteryV2 = () => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const prizeTotal = 668332

  return (
    <LotteryPage>
      <PageSection background={TITLEBG} svgFill={TITLEFILL} index={3}>
        <Heading color="#ffffff">{t('The PancakeSwapLottery')}</Heading>
        <Heading>{t(`$%prizeTotal%`, { prizeTotal: prizeTotal.toLocaleString() })}</Heading>
        <Heading color="#ffffff">{t('in prizes!')}</Heading>
      </PageSection>
      <PageSection background={GETTICKETSBG} hasCurvedDivider={false} index={2}>
        <Heading color="#ffffff">{t('Get your tickets now!')}</Heading>
      </PageSection>
      <PageSection background={isDark ? FINISHEDROUNDSBG_DARK : FINISHEDROUNDSBG} hasCurvedDivider={false} index={1}>
        <Heading color="#ffffff">{t('Finished Rounds')}</Heading>
      </PageSection>
      <PageSection background={isDark ? FINISHEDROUNDSBG_DARK : FINISHEDROUNDSBG} hasCurvedDivider={false} index={0}>
        <Heading color="#ffffff">{t('Finished Rounds')}</Heading>
      </PageSection>
    </LotteryPage>
  )
}

export default LotteryV2
